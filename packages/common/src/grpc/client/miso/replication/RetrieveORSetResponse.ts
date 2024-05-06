// Original file: src/grpc/replication.proto

import type { ORSetUpdate as _miso_replication_ORSetUpdate, ORSetUpdate__Output as _miso_replication_ORSetUpdate__Output } from '../../miso/replication/ORSetUpdate';
import type { BoolResponse as _miso_common_BoolResponse, BoolResponse__Output as _miso_common_BoolResponse__Output } from '../../miso/common/BoolResponse';

export interface RetrieveORSetResponse {
  'value'?: (_miso_replication_ORSetUpdate | null);
  'hasValue'?: (_miso_common_BoolResponse | null);
  '_value'?: "value";
}

export interface RetrieveORSetResponse__Output {
  'value'?: (_miso_replication_ORSetUpdate__Output | null);
  'hasValue': (_miso_common_BoolResponse__Output | null);
  '_value': "value";
}
