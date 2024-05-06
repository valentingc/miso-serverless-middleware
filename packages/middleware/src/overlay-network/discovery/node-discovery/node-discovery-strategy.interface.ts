import { TypedEventEmitter } from '../../../utils/typed-event-emitter.js';
import { NodeDiscoveryEvents } from './node-discovery-events.interface.js';

export interface NodeDiscoveryStrategy {
  eventEmitter: TypedEventEmitter<NodeDiscoveryEvents>;
  startDiscovery(): Promise<void>;
  getDiscoveredNodesWithIps(): Map<string, Set<string>>;
}
