// Original file: src/grpc/replication.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { CausalCrdtVectorClock as _miso_common_CausalCrdtVectorClock, CausalCrdtVectorClock__Output as _miso_common_CausalCrdtVectorClock__Output } from '../../miso/common/CausalCrdtVectorClock';
import type { ServerlessFunctionBaseInformation as _miso_common_ServerlessFunctionBaseInformation, ServerlessFunctionBaseInformation__Output as _miso_common_ServerlessFunctionBaseInformation__Output } from '../../miso/common/ServerlessFunctionBaseInformation';

export interface EWFlagUpdate {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'sentAtUtc'?: (_google_protobuf_Timestamp | null);
  'srcCurrentValue'?: (boolean);
  'vectorClock'?: (_miso_common_CausalCrdtVectorClock | null);
  'functionBase'?: (_miso_common_ServerlessFunctionBaseInformation | null);
}

export interface EWFlagUpdate__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'sentAtUtc': (_google_protobuf_Timestamp__Output | null);
  'srcCurrentValue': (boolean);
  'vectorClock': (_miso_common_CausalCrdtVectorClock__Output | null);
  'functionBase': (_miso_common_ServerlessFunctionBaseInformation__Output | null);
}
