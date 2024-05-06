// Original file: src/grpc/discovery-function.proto

import type { ServerlessFunctionBaseInformation as _miso_common_ServerlessFunctionBaseInformation, ServerlessFunctionBaseInformation__Output as _miso_common_ServerlessFunctionBaseInformation__Output } from '../../../../miso/common/ServerlessFunctionBaseInformation';

export interface ServerlessFunctionUnregisterRequest {
  'functionBase'?: (_miso_common_ServerlessFunctionBaseInformation | null);
  'podName'?: (string);
}

export interface ServerlessFunctionUnregisterRequest__Output {
  'functionBase': (_miso_common_ServerlessFunctionBaseInformation__Output | null);
  'podName': (string);
}
