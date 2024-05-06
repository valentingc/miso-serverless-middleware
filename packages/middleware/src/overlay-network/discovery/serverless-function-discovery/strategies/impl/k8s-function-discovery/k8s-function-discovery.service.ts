import { V1Pod } from '@kubernetes/client-node';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  MiddlewareConfig,
  ServerlessPlatform,
} from '../../../../../../config/middleware-config.js';
import { PodRefreshRequestEvent } from '../../../../../../replication/events/pod-refresh-request.event.js';
import { MiddlewareInstance } from '../../../../../../replication/interfaces/middleware-instance.interface.js';
import { EnvVarFunctionNameExtractionStrategy } from '../../../../../../replication/strategies/PodFunctionNameExtractionStrategy/impl/env-var-function-name-extraction.strategy.js';
import { PodFunctionNameExtractor } from '../../../../../../replication/strategies/PodFunctionNameExtractionStrategy/impl/pod-function-name-extractor.js';
import { jsonMapReplacer } from '../../../../../../utils/json.utils.js';
import { NodeDiscoveryStrategy } from '../../../../node-discovery/node-discovery-strategy.interface.js';
import { K8sCoreApiService } from '../../../../node-discovery/strategies/impl/k8s-node-discovery/k8s-core-api.service.js';
import { FunctionDiscoveryStrategy } from '../../../function-discovery-strategy.interface.js';
import { ServerlessFunctionInstance } from '../grpc-function-discovery/grpc-function-discovery.service.js';

@Injectable()
export class K8sFunctionDiscoveryService
  extends K8sCoreApiService
  implements FunctionDiscoveryStrategy
{
  private logger: Logger = new Logger(K8sFunctionDiscoveryService.name);
  private thisNodeName: string;
  private extractor: PodFunctionNameExtractor;
  private functionNamespace: string;
  private functionNodeMap: Map<string, ServerlessFunctionInstance[]> = new Map<
    string,
    ServerlessFunctionInstance[]
  >();

  constructor(
    configService: ConfigService<MiddlewareConfig>,
    eventEmitter2: EventEmitter2,
  ) {
    super(configService, eventEmitter2);

    this.thisNodeName = this.kubeOptions.nodeName;
    const serverlessPlatform =
      configService.get<ServerlessPlatform>('serverlessPlatform');
    if (serverlessPlatform === ServerlessPlatform.OPENFAAS) {
      this.extractor = new PodFunctionNameExtractor(
        new EnvVarFunctionNameExtractionStrategy(),
      );
    } else {
      throw new Error(
        'No Pod Function Name Extractor found for this serverless platform',
      );
    }

    this.functionNamespace = this.kubeOptions?.functionNamespace;
  }
  getServerlessFunctionInstancesForNode(
    nodeName: string,
  ): ServerlessFunctionInstance[] {
    const resultList: ServerlessFunctionInstance[] = [];
    this.functionNodeMap.forEach((value: ServerlessFunctionInstance[]) => {
      const filteredInstances = value.filter((v) => v.nodeName === nodeName);
      resultList.push(...filteredInstances);
    });
    return resultList;
  }

  @OnEvent('pods.refresh', { async: true })
  async handlePodsRefreshRequestEvent(payload: PodRefreshRequestEvent) {
    this.logger.debug('Event: pods.refresh');
    const newFunctionPods = await this.getK8sPodsByNamespace(
      this.functionNamespace,
    );
    newFunctionPods.forEach((value, key) => {
      this.logger.debug('REPLACING PODS FOR KEY: ' + key);
      this.functionNodeMap.set(key, value);
    });
    this.logger.debug(
      `For function '${
        payload.serverlessFunctionName
      }', we need to replicate to: ${JSON.stringify(
        this.functionNodeMap.get(payload.serverlessFunctionName),
      )}`,
    );
  }

  private _extractPodInformation(pod: V1Pod) {
    const podName = pod.metadata?.name;
    const nodeName = pod.spec?.nodeName;
    const nodeIp = pod.status?.hostIP;
    const podIp = pod.status?.podIP;
    this.logger.debug(
      'extracting pod: ' + JSON.stringify(pod, jsonMapReplacer),
    );
    if (
      podName === undefined ||
      nodeName === undefined ||
      nodeIp === undefined ||
      podIp === undefined
    ) {
      throw new Error(
        'podName, nodeName, nodeIp or podIp is undefined for this event',
      );
    }
    return { podName, nodeName, nodeIp, podIp };
  }
  async startDiscovery(
    nodeDiscoveryService: NodeDiscoveryStrategy,
  ): Promise<void> {
    const REFRESH_DELAY = 2000;
    let lastEventTimestamp = 0;
    let timerId: NodeJS.Timeout | undefined;

    this.logger.debug('Starting K8S function discovery');

    await this.watchNamespacedPods(
      this.functionNamespace,
      async (type, apiObj: V1Pod, watchObj) => {
        this.logger.debug('K8s Function watch event fired');
        lastEventTimestamp = Date.now();
        if (timerId) {
          clearTimeout(timerId);
        }
        timerId = setTimeout(async () => {
          if (Date.now() - lastEventTimestamp >= REFRESH_DELAY) {
            this.eventEmitter2.emit(
              'pods.refresh',
              new PodRefreshRequestEvent(this.functionNamespace, functionName),
            );
          }
        }, REFRESH_DELAY);
        const functionName = this.extractor.extractFunctionNameFromPod(apiObj);
        this.logger.debug(`${type} pod: ${apiObj.metadata?.name}`);

        const podName = apiObj.metadata?.name;
        if (!podName) {
          this.logger.error('podName is undefined');
          return;
        }
        if (
          apiObj.status?.phase === 'Failed' ||
          apiObj.status?.phase === 'Pending'
        ) {
          return;
        }
        if (type === 'ADDED') {
          const { nodeName, nodeIp, podIp } =
            this._extractPodInformation(apiObj);
          const createdTimestamp = Date.now();
          this._addToFunctionPodNodeMap(functionName, {
            podName: podName,
            nodeName: nodeName,
            serverlessFunctionName: functionName,
            nodeIp: nodeIp,
            lastHeartbeatTimestamp: createdTimestamp,
            registeredAtTimestamp: createdTimestamp,
          });
        } else if (type === 'DELETED') {
          this._removeFromFunctionPodNodeMap(functionName, podName);
        } else if (type === 'MODIFIED') {
          if (
            apiObj.status?.phase === 'Failed' ||
            apiObj.metadata?.deletionTimestamp !== undefined
          ) {
            this._removeFromFunctionPodNodeMap(functionName, podName);
          }
        } else {
          this.logger.debug(`unknown type: ` + type);
        }
        this.logger.debug(
          `For function '${functionName}', we need to replicate to: ${JSON.stringify(
            this.functionNodeMap.get(functionName),
          )}`,
        );
      },
      undefined,
      `spec.nodeName=${process.env.MISO_NODE_NAME}`,
    );
  }
  private _addToFunctionPodNodeMap(
    functionName: string,
    entry: ServerlessFunctionInstance,
  ) {
    const functionNodeMapVal2 = this.functionNodeMap.get(functionName) ?? [];
    functionNodeMapVal2?.push(entry);
    this.functionNodeMap.set(functionName, functionNodeMapVal2);
  }
  private _removeFromFunctionPodNodeMap(functionName: string, podName: string) {
    if (this.functionNodeMap.has(functionName) === false) {
      return;
    }

    let functionNodeMapVal = this.functionNodeMap.get(functionName);
    functionNodeMapVal =
      functionNodeMapVal?.filter((v) => v.podName !== podName) || [];
    this.logger.debug(
      `REMOVING podName: ${podName} for function: ${functionName}`,
    );
    this.functionNodeMap.set(functionName, functionNodeMapVal);
  }

  async getReplicationTargets(
    serverlessFunctionName: string,
  ): Promise<Set<MiddlewareInstance>> {
    const values = this.functionNodeMap.get(serverlessFunctionName) || [];
    const result: Set<MiddlewareInstance> = new Set(
      values.map((val) => {
        const instance: MiddlewareInstance = {
          hostIpAddress: '',
          hostName: val.nodeName,
        };
        return instance;
      }),
    );
    return result;
  }
  async getK8sPodsByNamespace(
    namespace: string,
  ): Promise<Map<string, ServerlessFunctionInstance[]>> {
    try {
      const response = await this.coreK8sApi.listNamespacedPod(namespace);
      const map = new Map<string, ServerlessFunctionInstance[]>();

      for (const pod of response.body.items) {
        if (pod.status?.phase === 'Failed' || pod.status?.phase === 'Pending') {
          continue;
        }
        const { podName, nodeName, nodeIp, podIp } =
          this._extractPodInformation(pod);
        const functionName = this.extractor.extractFunctionNameFromPod(pod);
        if (nodeName === this.thisNodeName) {
          this.logger.debug(
            'Skipping podName because it runs on same node: ' + podName,
          );
          continue;
        }

        if (map.get(functionName) === undefined) {
          map.set(functionName, []);
        }
        let val: ServerlessFunctionInstance[] = map.get(functionName) || [];
        val = val.filter((e) => e.nodeName !== nodeName);
        const createdTimestamp = Date.now();
        val.push({
          nodeIp,
          nodeName,
          podName,
          serverlessFunctionName: functionName,
          lastHeartbeatTimestamp: createdTimestamp,
          registeredAtTimestamp: createdTimestamp,
        });
        map.set(functionName, val);
      }
      return map;
    } catch (error) {
      this.logger.error(error);
      return new Map();
    }
  }
}
