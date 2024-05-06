import { ServerlessFunctionFunctionInstanceMapResponse } from '@miso/common/dist/grpc/server/discovery-function.js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hostname } from 'os';
import {
  FunctionDiscoveryOptions,
  MiddlewareConfig,
  OverlayOptions,
} from '../../../../../../config/middleware-config.js';
import { ObjectsService } from '../../../../../../objects/objects.service.js';
import { MiddlewareInstance } from '../../../../../../replication/interfaces/middleware-instance.interface.js';
import { jsonMapReplacer } from '../../../../../../utils/json.utils.js';
import { TypedEventEmitter } from '../../../../../../utils/typed-event-emitter.js';
import {
  GrpcClientPackageType,
  GrpcClientService,
} from '../../../../../transports/grpc/grpc-client.service.js';
import { NodeDiscoveryEvents } from '../../../../node-discovery/node-discovery-events.interface.js';
import { NodeDiscoveryStrategy } from '../../../../node-discovery/node-discovery-strategy.interface.js';
import { FunctionDiscoveryStrategy } from '../../../function-discovery-strategy.interface.js';

export type ServerlessFunctionInstance = {
  serverlessFunctionName: string;
  podName: string;
  nodeName: string;
  nodeIp: string;
  registeredAtTimestamp: number;
  lastHeartbeatTimestamp: number;
  timer?: NodeJS.Timeout;
};

@Injectable()
export class GrpcFunctionDiscoveryService implements FunctionDiscoveryStrategy {
  public eventEmitter = new TypedEventEmitter<NodeDiscoveryEvents>();
  private logger: Logger = new Logger(GrpcFunctionDiscoveryService.name);
  private functionNodeMap: Map<string, ServerlessFunctionInstance[]> =
    new Map();
  private nodeDiscoveryService: NodeDiscoveryStrategy | undefined;
  private discoveryOptions: FunctionDiscoveryOptions;
  private thisNodeName: string;
  constructor(
    private readonly grpcClientService: GrpcClientService,
    private readonly configService: ConfigService<MiddlewareConfig>,
    private readonly objectsService: ObjectsService,
  ) {
    const discoveryOptions =
      configService.get<OverlayOptions>('overlay')?.discovery;
    if (discoveryOptions === undefined) {
      throw new Error('discoveryOptions is undefined');
    }
    this.discoveryOptions = discoveryOptions.function;
    this.thisNodeName = discoveryOptions.node.thisNodeName;
  }

  getServerlessFunctionInstancesForNode(
    nodeName: string,
  ): ServerlessFunctionInstance[] {
    const resultList: ServerlessFunctionInstance[] = [];
    this.functionNodeMap.forEach((value, key) => {
      const filteredInstances = value.filter((v) => v.nodeName === nodeName);
      resultList.push(...filteredInstances);
    });
    return resultList;
  }

  getFunctionInstanceMap(): miso.overlay.discovery.function.ServerlessFunctionFunctionInstanceMapResponse {
    const response: ServerlessFunctionFunctionInstanceMapResponse = {
      items: {},
    };

    for (const [key, instances] of this.functionNodeMap) {
      response.items[key] = {
        items: instances.map((i) => {
          const lastHeartbeatMs = i.lastHeartbeatTimestamp;
          const registeredMs = i.registeredAtTimestamp;
          const res: miso.overlay.discovery.function.ServerlessFunctionInstance =
            {
              nodeIp: i.nodeIp,
              nodeName: i.nodeName,
              podName: i.podName,
              lastHeartbeatTimestamp: {
                seconds: lastHeartbeatMs / 1000,
                nanos: (lastHeartbeatMs % 1000) * 1e6,
              },
              registeredAtTimestamp: {
                seconds: registeredMs / 1000,
                nanos: (registeredMs % 1000) * 1e6,
              },
            };
          return res;
        }),
      };
    }
    return response;
  }

  startDiscovery(nodeDiscoveryService: NodeDiscoveryStrategy): Promise<void> {
    this.logger.debug('Starting function discovery..');

    this.nodeDiscoveryService = nodeDiscoveryService;

    const sendFunctions = async (instance: MiddlewareInstance) => {
      this.logger.log('Sending all function mappings to new node..');
      await this._sendAllFunctionMappingsToNode({
        nodeIp: instance.hostIpAddress,
        nodeName: instance.hostName,
        podName: instance.hostName,
        serverlessFunctionName: 'unused',
        registeredAtTimestamp: 0,
        lastHeartbeatTimestamp: 0,
      });
    };

    this.nodeDiscoveryService.eventEmitter.on(
      'middleware:restarted-instance',
      sendFunctions,
    );
    this.nodeDiscoveryService.eventEmitter.on(
      'middleware:discovered-instance',
      sendFunctions,
    );
    return Promise.resolve();
  }

  async getReplicationTargets(
    serverlessFunctionName: string,
  ): Promise<Set<MiddlewareInstance>> {
    const functionInstances = this.functionNodeMap.get(serverlessFunctionName);
    if (functionInstances === undefined) {
      return new Set();
    }
    const result = new Set<MiddlewareInstance>();
    functionInstances.forEach((value) => {
      let alreadyExists = false;
      result.forEach((v) => {
        if (v.hostName === value.nodeName) {
          alreadyExists = true;
          return;
        }
      });
      if (alreadyExists === false && value.nodeName !== this.thisNodeName) {
        result.add({
          hostName: value.nodeName,
          hostIpAddress: value.nodeIp,
        });
      }
    });
    return result;
  }
  private _doesFunctionNodeMapContainPodName(
    serverlessFunctionName: string,
    podName: string,
  ) {
    return (
      this.functionNodeMap
        .get(serverlessFunctionName)
        ?.find((value) => value.podName === podName) !== undefined
    );
  }

  removeServerlessFunctionInstance(
    serverlessFunctionName: string,
    podName: string,
    isFromOtherNode = false,
  ): boolean {
    const instances = this.functionNodeMap.get(serverlessFunctionName) || [];
    this.logger.debug(
      'Instances? ' +
        JSON.stringify(instances, jsonMapReplacer) +
        ' fn name: ' +
        serverlessFunctionName,
    );
    const instance = instances.filter((v) => v.podName === podName)[0];
    if (instance === undefined) {
      this.logger.debug(
        "No need to remove serverless function instance as we don't have it for fn name: " +
          serverlessFunctionName +
          ' and podName: ' +
          podName,
      );
      return false;
    }
    this.logger.log(
      'Removing serverless function instance: ' +
        instance.podName +
        ' for function: ' +
        serverlessFunctionName +
        ' from functionNodeMap',
    );

    const newInstances = instances?.filter(
      (v) => v.podName !== instance.podName,
    );
    this.functionNodeMap.set(serverlessFunctionName, newInstances);

    if (isFromOtherNode === false) {
      this._tellOtherNodesAboutFunction(
        miso.overlay.discovery.function.ServerlessFunctionPodInfoRequestType
          .REMOVED,
        instance,
        true,
      );
    }

    return true;
  }

  private async _sendAllFunctionMappingsToNode(
    targetNode: ServerlessFunctionInstance,
  ) {
    const podsObject = {} as any;
    this.logger.log(
      'Sending all functions of this node as update to: ' +
        targetNode.nodeName +
        ' with ip: ' +
        targetNode.nodeIp +
        '',
    );
    for (const [functionName, entries] of this.functionNodeMap.entries()) {
      podsObject[functionName] = {
        items: entries.map((entry) => {
          const entryInstance: miso.overlay.discovery.function.ServerlessFunctionPodInfoMapValueItem =
            {
              nodeIp: entry.nodeIp,
              nodeName: entry.nodeName,
              podName: entry.podName,
            };
          return entryInstance;
        }),
      };
    }

    const payload: miso.overlay.discovery.function.ServerlessFunctionPodInfoRequest =
      {
        srcMiddlewareNodeIp: process.env.MISO_NODE_IP ?? 'unknown', // TODO fix me
        srcMiddlewareNodeName: process.env.MISO_NODE_NAME ?? 'unknown',
        srcMiddlewarePodName: hostname(),
        requestType:
          miso.overlay.discovery.function.ServerlessFunctionPodInfoRequestType
            .ADDED,
        serverlessFunctionPods: podsObject,
        firstInstanceofFunction: true,
      };
    const grpcPromise = await this.grpcClientService.callUnaryGrpcMethod(
      targetNode.nodeIp,
      'exchangeMiddlewareServerlessFunctionPodInfo',
      GrpcClientPackageType.PACKAGE_MISO_OVERLAY_DISCOVERY_FUNCTION,
      payload,
    );
  }
  private async _tellOtherNodesAboutFunction(
    requestType: miso.overlay.discovery.function.ServerlessFunctionPodInfoRequestType,
    instance: ServerlessFunctionInstance,
    firstInstanceofFunction: boolean,
    sendAllFunctions = false,
  ) {
    if (this.nodeDiscoveryService === undefined) {
      throw new Error('nodeDiscoveryService is undefined');
    }
    const nodes: Map<
      string,
      Set<string>
    > = this.nodeDiscoveryService.getDiscoveredNodesWithIps();
    this.logger.debug(
      `Telling ${
        nodes.size
      } nodes about the new serverless function (${JSON.stringify(
        [nodes.keys()],
        jsonMapReplacer,
      )})`,
    );

    for (const [key, valuesSet] of nodes.entries()) {
      try {
        this.logger.debug(`Node Name ${key} has ${valuesSet.size} ips}`);
        const grpcPromises = [];
        for (const ip of valuesSet) {
          this.logger.debug('Sending function info to ip: ' + ip.toString());

          const podsObject = {} as any;

          if (sendAllFunctions === false) {
            this.logger.verbose(
              'Sending only this function instance as update',
            );
            podsObject[instance.serverlessFunctionName] = {
              items: [
                {
                  nodeIp: instance.nodeIp,
                  nodeName: instance.nodeName,
                  podName: instance.podName,
                },
              ],
            };
          } else {
            this.logger.verbose('Sending all functions of this node as update');
            for (const [
              functionName,
              entries,
            ] of this.functionNodeMap.entries()) {
              podsObject[functionName] = {
                items: entries.map((entry) => {
                  const entryInstance: miso.overlay.discovery.function.ServerlessFunctionPodInfoMapValueItem =
                    {
                      nodeIp: entry.nodeIp,
                      nodeName: entry.nodeName,
                      podName: entry.podName,
                    };
                  return entryInstance;
                }),
              };
            }
          }
          const payload: miso.overlay.discovery.function.ServerlessFunctionPodInfoRequest =
            {
              srcMiddlewareNodeIp: process.env.MISO_NODE_IP ?? 'unknown', // TODO fix me
              srcMiddlewareNodeName: process.env.MISO_NODE_NAME ?? 'unknown',
              srcMiddlewarePodName: hostname(),
              requestType: requestType,
              serverlessFunctionPods: podsObject,
              firstInstanceofFunction: firstInstanceofFunction,
            };
          const grpcPromise = await this.grpcClientService.callUnaryGrpcMethod(
            ip,
            'exchangeMiddlewareServerlessFunctionPodInfo',
            GrpcClientPackageType.PACKAGE_MISO_OVERLAY_DISCOVERY_FUNCTION,
            payload,
          );
          grpcPromises.push(grpcPromise);
        }
        await Promise.all(grpcPromises);
      } catch (error) {
        this.logger.error(error);
      }
    }
  }

  async exchangeMiddlewareServerlessFunctionPodInfo(
    request: miso.overlay.discovery.function.ServerlessFunctionPodInfoRequest,
  ) {
    const newEntries = Object.entries(request.serverlessFunctionPods);

    for (const [functionName, entries] of newEntries) {
      entries.items.forEach(
        async (
          item: miso.overlay.discovery.function.ServerlessFunctionPodInfoMapValueItem,
        ) => {
          if (item.podName === '') {
            this.logger.error('item.podName is empty..!');
            return;
          }

          switch (request.requestType) {
            case miso.overlay.discovery.function
              .ServerlessFunctionPodInfoRequestType.ADDED:
              await this.registerServerlessFunction(
                functionName,
                item.podName,
                item.nodeIp,
                item.nodeName,
                request.firstInstanceofFunction,
                true,
              );
              break;
            case miso.overlay.discovery.function
              .ServerlessFunctionPodInfoRequestType.REMOVED:
              const podName =
                request.serverlessFunctionPods[functionName].items[0].podName;
              this.removeServerlessFunctionInstance(
                functionName,
                podName,
                true,
              );
              break;
          }
        },
      );
    }
  }

  hasServerlessFunction(serverlessFunctionName: string): boolean {
    const res = this.functionNodeMap.get(serverlessFunctionName) ?? [];
    return res.some((v) => v.nodeName === this.thisNodeName);
  }
  async registerServerlessFunction(
    serverlessFunctionName: string,
    podName: string,
    nodeIp: string,
    nodeName: string,
    firstInstanceofFunction: boolean,
    isFromOtherNode = false,
  ): Promise<boolean> {
    let currentValue: ServerlessFunctionInstance[] | undefined =
      this.functionNodeMap.get(serverlessFunctionName);
    if (currentValue === undefined) {
      currentValue = [];
    }

    const alreadyExists = this._doesFunctionNodeMapContainPodName(
      serverlessFunctionName,
      podName,
    );
    if (alreadyExists) {
      const instance = currentValue.find((i) => i.podName === podName);
      if (instance === undefined) {
        throw new Error('Did not find instance anymore');
      }
      instance.lastHeartbeatTimestamp = Date.now();
      instance.timer?.refresh();
      this.functionNodeMap.set(serverlessFunctionName, currentValue);
      return false;
    }
    const createdTimestamp = Date.now();
    const newInstance: ServerlessFunctionInstance = {
      nodeIp,
      nodeName,
      podName,
      serverlessFunctionName,
      registeredAtTimestamp: createdTimestamp,
      lastHeartbeatTimestamp: createdTimestamp,
      timer: undefined,
    };
    currentValue.push(newInstance);

    this.functionNodeMap.set(serverlessFunctionName, currentValue);
    this.logger.log(
      'Registered new serverless function: ' +
        serverlessFunctionName +
        ' on pod: ' +
        podName +
        ' on node: ' +
        nodeName +
        ' with ip: ' +
        nodeIp +
        '; functionNodeMap: ' +
        JSON.stringify(this.functionNodeMap, jsonMapReplacer),
    );
    if (isFromOtherNode === false) {
      await this._tellOtherNodesAboutFunction(
        miso.overlay.discovery.function.ServerlessFunctionPodInfoRequestType
          .ADDED,
        newInstance,
        firstInstanceofFunction,
        true,
      );
    }

    return true;
  }
}
