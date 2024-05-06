// Original file: src/grpc/replication.proto

import type { EWFlagUpdate as _miso_replication_EWFlagUpdate, EWFlagUpdate__Output as _miso_replication_EWFlagUpdate__Output } from '../../miso/replication/EWFlagUpdate';
import type { BoolResponse as _miso_common_BoolResponse, BoolResponse__Output as _miso_common_BoolResponse__Output } from '../../miso/common/BoolResponse';

export interface RetrieveEWFlagResponse {
  'value'?: (_miso_replication_EWFlagUpdate | null);
  'hasValue'?: (_miso_common_BoolResponse | null);
  '_value'?: "value";
}

export interface RetrieveEWFlagResponse__Output {
  'value'?: (_miso_replication_EWFlagUpdate__Output | null);
  'hasValue': (_miso_common_BoolResponse__Output | null);
  '_value': "value";
}
