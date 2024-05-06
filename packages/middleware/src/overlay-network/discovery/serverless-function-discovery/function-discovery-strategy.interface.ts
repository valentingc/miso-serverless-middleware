import { MiddlewareInstance } from '../../../replication/interfaces/middleware-instance.interface.js';
import { NodeDiscoveryStrategy } from '../node-discovery/node-discovery-strategy.interface.js';
import { ServerlessFunctionInstance } from './strategies/impl/grpc-function-discovery/grpc-function-discovery.service.js';

export interface FunctionDiscoveryStrategy {
  startDiscovery(nodeDiscoveryService: NodeDiscoveryStrategy): Promise<void>;
  getReplicationTargets(
    serverlessFunctionName: string,
  ): Promise<Set<MiddlewareInstance>>;

  getServerlessFunctionInstancesForNode(
    nodeName: string,
  ): ServerlessFunctionInstance[];
}
