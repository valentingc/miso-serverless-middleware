// Original file: src/grpc/replication.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { CausalCrdtVectorClock as _miso_common_CausalCrdtVectorClock, CausalCrdtVectorClock__Output as _miso_common_CausalCrdtVectorClock__Output } from '../../miso/common/CausalCrdtVectorClock';
import type { ServerlessFunctionBaseInformation as _miso_common_ServerlessFunctionBaseInformation, ServerlessFunctionBaseInformation__Output as _miso_common_ServerlessFunctionBaseInformation__Output } from '../../miso/common/ServerlessFunctionBaseInformation';
import type { SetGenericType as _miso_common_SetGenericType, SetGenericType__Output as _miso_common_SetGenericType__Output } from '../../miso/common/SetGenericType';
import type { SetOrRegisterValueResponseStringValues as _miso_common_SetOrRegisterValueResponseStringValues, SetOrRegisterValueResponseStringValues__Output as _miso_common_SetOrRegisterValueResponseStringValues__Output } from '../../miso/common/SetOrRegisterValueResponseStringValues';
import type { SetOrRegisterValueResponseNumberValues as _miso_common_SetOrRegisterValueResponseNumberValues, SetOrRegisterValueResponseNumberValues__Output as _miso_common_SetOrRegisterValueResponseNumberValues__Output } from '../../miso/common/SetOrRegisterValueResponseNumberValues';
import type { SetOrRegisterValueResponseObjectValues as _miso_common_SetOrRegisterValueResponseObjectValues, SetOrRegisterValueResponseObjectValues__Output as _miso_common_SetOrRegisterValueResponseObjectValues__Output } from '../../miso/common/SetOrRegisterValueResponseObjectValues';

export interface MVRegisterUpdate {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'sentAtUtc'?: (_google_protobuf_Timestamp | null);
  'srcCurrentValue'?: (boolean);
  'vectorClock'?: (_miso_common_CausalCrdtVectorClock | null);
  'functionBase'?: (_miso_common_ServerlessFunctionBaseInformation | null);
  'type'?: (_miso_common_SetGenericType);
  'valuesString'?: (_miso_common_SetOrRegisterValueResponseStringValues | null);
  'valuesNumber'?: (_miso_common_SetOrRegisterValueResponseNumberValues | null);
  'valuesObject'?: (_miso_common_SetOrRegisterValueResponseObjectValues | null);
  'val'?: "valuesString"|"valuesNumber"|"valuesObject";
}

export interface MVRegisterUpdate__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'sentAtUtc': (_google_protobuf_Timestamp__Output | null);
  'srcCurrentValue': (boolean);
  'vectorClock': (_miso_common_CausalCrdtVectorClock__Output | null);
  'functionBase': (_miso_common_ServerlessFunctionBaseInformation__Output | null);
  'type': (_miso_common_SetGenericType__Output);
  'valuesString'?: (_miso_common_SetOrRegisterValueResponseStringValues__Output | null);
  'valuesNumber'?: (_miso_common_SetOrRegisterValueResponseNumberValues__Output | null);
  'valuesObject'?: (_miso_common_SetOrRegisterValueResponseObjectValues__Output | null);
  'val': "valuesString"|"valuesNumber"|"valuesObject";
}
