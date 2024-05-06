// Original file: src/grpc/middleware.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { ServerlessFunctionBaseInformation as _miso_common_ServerlessFunctionBaseInformation, ServerlessFunctionBaseInformation__Output as _miso_common_ServerlessFunctionBaseInformation__Output } from '../../miso/common/ServerlessFunctionBaseInformation';

export interface FlagSetValueRequest {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'value'?: (boolean);
  'functionBase'?: (_miso_common_ServerlessFunctionBaseInformation | null);
  'replicaId'?: (string);
}

export interface FlagSetValueRequest__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'value': (boolean);
  'functionBase': (_miso_common_ServerlessFunctionBaseInformation__Output | null);
  'replicaId': (string);
}
