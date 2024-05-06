// Original file: src/grpc/replication.proto

import type { SetGenericType as _miso_common_SetGenericType, SetGenericType__Output as _miso_common_SetGenericType__Output } from '../../miso/common/SetGenericType';
import type { CRDTSetType as _miso_common_CRDTSetType, CRDTSetType__Output as _miso_common_CRDTSetType__Output } from '../../miso/common/CRDTSetType';

export interface ORMapUpdateEntry {
  'keyType'?: (_miso_common_SetGenericType);
  'valueCrdtType'?: (_miso_common_CRDTSetType);
  'valueCrdtName'?: (string);
}

export interface ORMapUpdateEntry__Output {
  'keyType': (_miso_common_SetGenericType__Output);
  'valueCrdtType': (_miso_common_CRDTSetType__Output);
  'valueCrdtName': (string);
}
