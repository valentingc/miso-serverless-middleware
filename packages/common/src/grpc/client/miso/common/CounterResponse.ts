// Original file: src/grpc/common.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { Long } from '@grpc/proto-loader';

export interface CounterResponse {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'value'?: (number | string | Long);
}

export interface CounterResponse__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'value': (string);
}
