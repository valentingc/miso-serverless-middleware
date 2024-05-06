// Original file: src/grpc/replication.proto

import type { MVRegisterUpdate as _miso_replication_MVRegisterUpdate, MVRegisterUpdate__Output as _miso_replication_MVRegisterUpdate__Output } from '../../miso/replication/MVRegisterUpdate';
import type { BoolResponse as _miso_common_BoolResponse, BoolResponse__Output as _miso_common_BoolResponse__Output } from '../../miso/common/BoolResponse';

export interface RetrieveMVRegisterResponse {
  'value'?: (_miso_replication_MVRegisterUpdate | null);
  'hasValue'?: (_miso_common_BoolResponse | null);
  '_value'?: "value";
}

export interface RetrieveMVRegisterResponse__Output {
  'value'?: (_miso_replication_MVRegisterUpdate__Output | null);
  'hasValue': (_miso_common_BoolResponse__Output | null);
  '_value': "value";
}
