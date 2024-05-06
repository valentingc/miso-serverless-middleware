import { AllowedGrpcReplicationMethods } from '../../overlay-network/transports/grpc/grpc-client.service.js';
import { CrdtType } from '../../utils/crdt-type.enum.js';

export interface ReplicationTask {
  statefulObjectId: string;
  crdtName: string;
  crdtType: CrdtType;
  serverlessFunctionName: string;
  payload: any;
  grpcMethod: AllowedGrpcReplicationMethods;
  retryCount: number;
}
