// Original file: src/grpc/middleware.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { ServerlessFunctionBaseInformation as _miso_common_ServerlessFunctionBaseInformation, ServerlessFunctionBaseInformation__Output as _miso_common_ServerlessFunctionBaseInformation__Output } from '../../miso/common/ServerlessFunctionBaseInformation';
import type { SetGenericType as _miso_common_SetGenericType, SetGenericType__Output as _miso_common_SetGenericType__Output } from '../../miso/common/SetGenericType';

export interface MapGetKeysRequest {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'functionBase'?: (_miso_common_ServerlessFunctionBaseInformation | null);
  'keyType'?: (_miso_common_SetGenericType);
}

export interface MapGetKeysRequest__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'functionBase': (_miso_common_ServerlessFunctionBaseInformation__Output | null);
  'keyType': (_miso_common_SetGenericType__Output);
}
