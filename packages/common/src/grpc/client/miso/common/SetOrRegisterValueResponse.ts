// Original file: src/grpc/common.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { SetOrRegisterValueResponseStringValues as _miso_common_SetOrRegisterValueResponseStringValues, SetOrRegisterValueResponseStringValues__Output as _miso_common_SetOrRegisterValueResponseStringValues__Output } from '../../miso/common/SetOrRegisterValueResponseStringValues';
import type { SetOrRegisterValueResponseNumberValues as _miso_common_SetOrRegisterValueResponseNumberValues, SetOrRegisterValueResponseNumberValues__Output as _miso_common_SetOrRegisterValueResponseNumberValues__Output } from '../../miso/common/SetOrRegisterValueResponseNumberValues';
import type { SetOrRegisterValueResponseObjectValues as _miso_common_SetOrRegisterValueResponseObjectValues, SetOrRegisterValueResponseObjectValues__Output as _miso_common_SetOrRegisterValueResponseObjectValues__Output } from '../../miso/common/SetOrRegisterValueResponseObjectValues';
import type { SetGenericType as _miso_common_SetGenericType, SetGenericType__Output as _miso_common_SetGenericType__Output } from '../../miso/common/SetGenericType';

export interface SetOrRegisterValueResponse {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'valuesString'?: (_miso_common_SetOrRegisterValueResponseStringValues | null);
  'valuesNumber'?: (_miso_common_SetOrRegisterValueResponseNumberValues | null);
  'valuesObject'?: (_miso_common_SetOrRegisterValueResponseObjectValues | null);
  'type'?: (_miso_common_SetGenericType);
  'val'?: "valuesString"|"valuesNumber"|"valuesObject";
}

export interface SetOrRegisterValueResponse__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'valuesString'?: (_miso_common_SetOrRegisterValueResponseStringValues__Output | null);
  'valuesNumber'?: (_miso_common_SetOrRegisterValueResponseNumberValues__Output | null);
  'valuesObject'?: (_miso_common_SetOrRegisterValueResponseObjectValues__Output | null);
  'type': (_miso_common_SetGenericType__Output);
  'val': "valuesString"|"valuesNumber"|"valuesObject";
}
