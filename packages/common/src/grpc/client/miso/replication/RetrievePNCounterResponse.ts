// Original file: src/grpc/replication.proto

import type { PNCounterUpdate as _miso_replication_PNCounterUpdate, PNCounterUpdate__Output as _miso_replication_PNCounterUpdate__Output } from '../../miso/replication/PNCounterUpdate';
import type { BoolResponse as _miso_common_BoolResponse, BoolResponse__Output as _miso_common_BoolResponse__Output } from '../../miso/common/BoolResponse';

export interface RetrievePNCounterResponse {
  'value'?: (_miso_replication_PNCounterUpdate | null);
  'hasValue'?: (_miso_common_BoolResponse | null);
  '_value'?: "value";
}

export interface RetrievePNCounterResponse__Output {
  'value'?: (_miso_replication_PNCounterUpdate__Output | null);
  'hasValue': (_miso_common_BoolResponse__Output | null);
  '_value': "value";
}
