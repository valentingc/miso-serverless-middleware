import { MiddlewareInstance } from '../../../replication/interfaces/middleware-instance.interface.js';

export interface NodeDiscoveryEvents {
  'middleware:discovered-ip': string;
  'middleware:discovered-hostname': string;
  'middleware:discovered-instance': MiddlewareInstance;
  'middleware:restarted-instance': MiddlewareInstance;
}
