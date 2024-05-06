// Original file: src/grpc/discovery-function.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../../google/protobuf/Timestamp';

export interface ServerlessFunctionInstance {
  'podName'?: (string);
  'nodeName'?: (string);
  'nodeIp'?: (string);
  'registeredAtTimestamp'?: (_google_protobuf_Timestamp | null);
  'lastHeartbeatTimestamp'?: (_google_protobuf_Timestamp | null);
}

export interface ServerlessFunctionInstance__Output {
  'podName': (string);
  'nodeName': (string);
  'nodeIp': (string);
  'registeredAtTimestamp': (_google_protobuf_Timestamp__Output | null);
  'lastHeartbeatTimestamp': (_google_protobuf_Timestamp__Output | null);
}
