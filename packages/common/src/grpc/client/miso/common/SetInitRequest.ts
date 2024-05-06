// Original file: src/grpc/common.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { ServerlessFunctionBaseInformation as _miso_common_ServerlessFunctionBaseInformation, ServerlessFunctionBaseInformation__Output as _miso_common_ServerlessFunctionBaseInformation__Output } from '../../miso/common/ServerlessFunctionBaseInformation';
import type { SetGenericType as _miso_common_SetGenericType, SetGenericType__Output as _miso_common_SetGenericType__Output } from '../../miso/common/SetGenericType';
import type { CRDTSetType as _miso_common_CRDTSetType, CRDTSetType__Output as _miso_common_CRDTSetType__Output } from '../../miso/common/CRDTSetType';

export interface SetInitRequest {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'functionBase'?: (_miso_common_ServerlessFunctionBaseInformation | null);
  'setGenerictype'?: (_miso_common_SetGenericType);
  'crdtSetType'?: (_miso_common_CRDTSetType);
}

export interface SetInitRequest__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'functionBase': (_miso_common_ServerlessFunctionBaseInformation__Output | null);
  'setGenerictype': (_miso_common_SetGenericType__Output);
  'crdtSetType': (_miso_common_CRDTSetType__Output);
}
