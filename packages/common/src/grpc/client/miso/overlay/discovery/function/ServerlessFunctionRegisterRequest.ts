// Original file: src/grpc/discovery-function.proto

import type { ServerlessFunctionBaseInformation as _miso_common_ServerlessFunctionBaseInformation, ServerlessFunctionBaseInformation__Output as _miso_common_ServerlessFunctionBaseInformation__Output } from '../../../../miso/common/ServerlessFunctionBaseInformation';

export interface ServerlessFunctionRegisterRequest {
  'functionBase'?: (_miso_common_ServerlessFunctionBaseInformation | null);
  'podName'?: (string);
  'nodeName'?: (string);
  'nodeIp'?: (string);
}

export interface ServerlessFunctionRegisterRequest__Output {
  'functionBase': (_miso_common_ServerlessFunctionBaseInformation__Output | null);
  'podName': (string);
  'nodeName': (string);
  'nodeIp': (string);
}
