import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  MiddlewareConfig,
  ServerlessPlatform,
} from '../../../../../../config/middleware-config.js';
import { TypedEventEmitter } from '../../../../../../utils/typed-event-emitter.js';
import { NodeDiscoveryEvents } from '../../../node-discovery-events.interface.js';
import { NodeDiscoveryStrategy } from '../../../node-discovery-strategy.interface.js';
import { PodNodeNameExtractor } from '../../node-name-pod-extraction-strategy/pod-node-name-extractor.js';
import { V1PodNodeNameExtractionStrategy } from '../../node-name-pod-extraction-strategy/v1pod-node-name-extraction.strategy.js';
import { NodeRefreshRequestEvent } from './events/node-refresh-requested.event.js';
import { K8sCoreApiService } from './k8s-core-api.service.js';

@Injectable()
export class K8sNodeDiscoveryService
  extends K8sCoreApiService
  implements NodeDiscoveryStrategy
{
  public eventEmitter = new TypedEventEmitter<NodeDiscoveryEvents>();
  private logger: Logger = new Logger(K8sNodeDiscoveryService.name);
  private thisNodeName: string;
  private extractor: PodNodeNameExtractor;
  private nodeNameToIPs: Map<string, Set<string>> = new Map();
  private daemonSetNamespace: string;

  constructor(
    configService: ConfigService<MiddlewareConfig>,
    eventEmitter2: EventEmitter2,
  ) {
    super(configService, eventEmitter2);

    this.thisNodeName = this.kubeOptions.nodeName;
    const serverlessPlatform =
      configService.get<ServerlessPlatform>('serverlessPlatform');
    if (serverlessPlatform === ServerlessPlatform.OPENFAAS) {
      this.extractor = new PodNodeNameExtractor(
        new V1PodNodeNameExtractionStrategy(),
      );
    } else {
      throw new Error(
        'No Pod Function Name Extractor found for this serverless platform',
      );
    }

    this.daemonSetNamespace = this.kubeOptions?.middlewareNamespace;
  }
  async startDiscovery(): Promise<void> {
    this.logger.debug('Starting K8S node discovery');
    const REFRESH_DELAY = 2000;
    let lastEventTimestamp = 0;
    let timerId: NodeJS.Timeout | undefined;
    this.watchNamespacedPods(
      this.daemonSetNamespace,
      async (type, apiObj, watchObj) => {
        lastEventTimestamp = Date.now();
        if (timerId) {
          clearTimeout(timerId);
        }
        timerId = setTimeout(async () => {
          if (Date.now() - lastEventTimestamp >= REFRESH_DELAY) {
            this.eventEmitter2.emit(
              'node.refresh',
              new NodeRefreshRequestEvent(this.daemonSetNamespace),
            );
          }
        }, REFRESH_DELAY);
        this.logger.debug(`${type} pod: ${apiObj.metadata.name}`);

        const instanceName = this.extractor.extractNodeNameFromPod(apiObj);

        if (type === 'ADDED') {
          this.logger.debug('added middleware instance: ' + instanceName);
          this.nodeNameToIPs.set(
            instanceName,
            new Set<string>(apiObj.status.podIP),
          );
        } else if (type === 'DELETED') {
          this.logger.debug('deleted middleware instance: ' + instanceName);
          this.nodeNameToIPs.get(instanceName)?.delete(apiObj.status.podIP);
          this.eventEmitter.emit(
            'middleware:discovered-ip',
            apiObj.status.podIP,
          );
          if (this.nodeNameToIPs.get(instanceName)?.size === 0) {
            this.logger.debug(
              'completely deleted middleware instance, no IP left: ' +
                instanceName,
            );
            this.nodeNameToIPs.delete(instanceName);
          }
        } else if (type === 'MODIFIED') {
          this.logger.debug('modified middleware instance: ' + instanceName);
          this.nodeNameToIPs.get(instanceName)?.add(apiObj.status.podIP);
        } else {
          this.logger.debug(`unknown type: ` + type);
        }
      },
      'k8s-app=miso-middleware',
      undefined,
    );

    // const daemonSetPods = await this.coreK8sApi.listNamespacedPod(
    //   this.daemonSetNamespace,
    //   undefined,
    //   undefined,
    //   undefined,
    //   undefined,
    //   'k8s-app=miso-middleware',
    // );
    // let result;
    // if (daemonSetPods?.body.items.length > 0) {
    //   result = daemonSetPods?.body?.items[0]?.status?.podIP;
    // }
    // if (result === undefined) {
    //   throw new Error(
    //     'No daemonset pods found in namespace: ' + this.daemonSetNamespace,
    //   );
    // }

    // return result;
  }
  getDiscoveredNodesWithIps(): Map<string, Set<string>> {
    return new Map<string, Set<string>>(this.nodeNameToIPs);
  }

  @OnEvent('node.refresh', { async: true })
  async handleNodeRefreshRequestEvent(payload: NodeRefreshRequestEvent) {
    this.logger.debug('Event: node.refresh');
  }

}
