// Original file: src/grpc/middleware.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { SetOrRegisterValueResponseStringValues as _miso_common_SetOrRegisterValueResponseStringValues, SetOrRegisterValueResponseStringValues__Output as _miso_common_SetOrRegisterValueResponseStringValues__Output } from '../../miso/common/SetOrRegisterValueResponseStringValues';
import type { SetOrRegisterValueResponseNumberValues as _miso_common_SetOrRegisterValueResponseNumberValues, SetOrRegisterValueResponseNumberValues__Output as _miso_common_SetOrRegisterValueResponseNumberValues__Output } from '../../miso/common/SetOrRegisterValueResponseNumberValues';
import type { SetOrRegisterValueResponseObjectValues as _miso_common_SetOrRegisterValueResponseObjectValues, SetOrRegisterValueResponseObjectValues__Output as _miso_common_SetOrRegisterValueResponseObjectValues__Output } from '../../miso/common/SetOrRegisterValueResponseObjectValues';

export interface MapGetKeysResponse {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'keysString'?: (_miso_common_SetOrRegisterValueResponseStringValues | null);
  'keysNumber'?: (_miso_common_SetOrRegisterValueResponseNumberValues | null);
  'keysObject'?: (_miso_common_SetOrRegisterValueResponseObjectValues | null);
  'keys'?: "keysString"|"keysNumber"|"keysObject";
}

export interface MapGetKeysResponse__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'keysString'?: (_miso_common_SetOrRegisterValueResponseStringValues__Output | null);
  'keysNumber'?: (_miso_common_SetOrRegisterValueResponseNumberValues__Output | null);
  'keysObject'?: (_miso_common_SetOrRegisterValueResponseObjectValues__Output | null);
  'keys': "keysString"|"keysNumber"|"keysObject";
}
