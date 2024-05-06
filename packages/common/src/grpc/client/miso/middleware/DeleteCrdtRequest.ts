// Original file: src/grpc/middleware.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { ServerlessFunctionBaseInformation as _miso_common_ServerlessFunctionBaseInformation, ServerlessFunctionBaseInformation__Output as _miso_common_ServerlessFunctionBaseInformation__Output } from '../../miso/common/ServerlessFunctionBaseInformation';

export interface DeleteCrdtRequest {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'functionBase'?: (_miso_common_ServerlessFunctionBaseInformation | null);
}

export interface DeleteCrdtRequest__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'functionBase': (_miso_common_ServerlessFunctionBaseInformation__Output | null);
}
