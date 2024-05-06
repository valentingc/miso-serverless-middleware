// Original file: src/grpc/middleware.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { ServerlessFunctionBaseInformation as _miso_common_ServerlessFunctionBaseInformation, ServerlessFunctionBaseInformation__Output as _miso_common_ServerlessFunctionBaseInformation__Output } from '../../miso/common/ServerlessFunctionBaseInformation';

export interface MapDeleteValueRequest {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'keyString'?: (string);
  'keyNumber'?: (number | string);
  'functionBase'?: (_miso_common_ServerlessFunctionBaseInformation | null);
  'key'?: "keyString"|"keyNumber";
}

export interface MapDeleteValueRequest__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'keyString'?: (string);
  'keyNumber'?: (number);
  'functionBase': (_miso_common_ServerlessFunctionBaseInformation__Output | null);
  'key': "keyString"|"keyNumber";
}
