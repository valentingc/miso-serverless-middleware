// Original file: src/grpc/middleware.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { CRDTSetType as _miso_common_CRDTSetType, CRDTSetType__Output as _miso_common_CRDTSetType__Output } from '../../miso/common/CRDTSetType';
import type { ServerlessFunctionBaseInformation as _miso_common_ServerlessFunctionBaseInformation, ServerlessFunctionBaseInformation__Output as _miso_common_ServerlessFunctionBaseInformation__Output } from '../../miso/common/ServerlessFunctionBaseInformation';

export interface MapSetValueRequest {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'replicaId'?: (string);
  'keyString'?: (string);
  'keyNumber'?: (number | string);
  'valueCrdtType'?: (_miso_common_CRDTSetType);
  'valueCrdtName'?: (string);
  'functionBase'?: (_miso_common_ServerlessFunctionBaseInformation | null);
  'key'?: "keyString"|"keyNumber";
}

export interface MapSetValueRequest__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'replicaId': (string);
  'keyString'?: (string);
  'keyNumber'?: (number);
  'valueCrdtType': (_miso_common_CRDTSetType__Output);
  'valueCrdtName': (string);
  'functionBase': (_miso_common_ServerlessFunctionBaseInformation__Output | null);
  'key': "keyString"|"keyNumber";
}
