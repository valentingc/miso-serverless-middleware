// Original file: src/grpc/replication.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { ServerlessFunctionBaseInformation as _miso_common_ServerlessFunctionBaseInformation, ServerlessFunctionBaseInformation__Output as _miso_common_ServerlessFunctionBaseInformation__Output } from '../../miso/common/ServerlessFunctionBaseInformation';
import type { Long } from '@grpc/proto-loader';

export interface GCounterUpdate {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'sentAtUtc'?: (_google_protobuf_Timestamp | null);
  'srcMap'?: ({[key: string]: number | string | Long});
  'srcCurrentValue'?: (number | string | Long);
  'functionBase'?: (_miso_common_ServerlessFunctionBaseInformation | null);
}

export interface GCounterUpdate__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'sentAtUtc': (_google_protobuf_Timestamp__Output | null);
  'srcMap': ({[key: string]: string});
  'srcCurrentValue': (string);
  'functionBase': (_miso_common_ServerlessFunctionBaseInformation__Output | null);
}
