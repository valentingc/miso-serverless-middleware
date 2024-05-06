// Original file: src/grpc/middleware.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { ServerlessFunctionBaseInformation as _miso_common_ServerlessFunctionBaseInformation, ServerlessFunctionBaseInformation__Output as _miso_common_ServerlessFunctionBaseInformation__Output } from '../../miso/common/ServerlessFunctionBaseInformation';
import type { Long } from '@grpc/proto-loader';

export interface CounterAddOrSubtractValueRequest {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'replicaId'?: (string);
  'value'?: (number | string | Long);
  'functionBase'?: (_miso_common_ServerlessFunctionBaseInformation | null);
}

export interface CounterAddOrSubtractValueRequest__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'replicaId': (string);
  'value': (string);
  'functionBase': (_miso_common_ServerlessFunctionBaseInformation__Output | null);
}
