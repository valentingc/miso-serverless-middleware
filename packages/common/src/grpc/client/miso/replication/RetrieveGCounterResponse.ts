// Original file: src/grpc/replication.proto

import type { GCounterUpdate as _miso_replication_GCounterUpdate, GCounterUpdate__Output as _miso_replication_GCounterUpdate__Output } from '../../miso/replication/GCounterUpdate';
import type { BoolResponse as _miso_common_BoolResponse, BoolResponse__Output as _miso_common_BoolResponse__Output } from '../../miso/common/BoolResponse';

export interface RetrieveGCounterResponse {
  'value'?: (_miso_replication_GCounterUpdate | null);
  'hasValue'?: (_miso_common_BoolResponse | null);
  '_value'?: "value";
}

export interface RetrieveGCounterResponse__Output {
  'value'?: (_miso_replication_GCounterUpdate__Output | null);
  'hasValue': (_miso_common_BoolResponse__Output | null);
  '_value': "value";
}
