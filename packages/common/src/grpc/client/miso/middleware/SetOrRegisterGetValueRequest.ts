// Original file: src/grpc/middleware.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { SetGenericType as _miso_common_SetGenericType, SetGenericType__Output as _miso_common_SetGenericType__Output } from '../../miso/common/SetGenericType';
import type { CRDTSetType as _miso_common_CRDTSetType, CRDTSetType__Output as _miso_common_CRDTSetType__Output } from '../../miso/common/CRDTSetType';
import type { ServerlessFunctionBaseInformation as _miso_common_ServerlessFunctionBaseInformation, ServerlessFunctionBaseInformation__Output as _miso_common_ServerlessFunctionBaseInformation__Output } from '../../miso/common/ServerlessFunctionBaseInformation';

export interface SetOrRegisterGetValueRequest {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'replicaId'?: (string);
  'type'?: (_miso_common_SetGenericType);
  'crdtType'?: (_miso_common_CRDTSetType);
  'functionBase'?: (_miso_common_ServerlessFunctionBaseInformation | null);
}

export interface SetOrRegisterGetValueRequest__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'replicaId': (string);
  'type': (_miso_common_SetGenericType__Output);
  'crdtType': (_miso_common_CRDTSetType__Output);
  'functionBase': (_miso_common_ServerlessFunctionBaseInformation__Output | null);
}
