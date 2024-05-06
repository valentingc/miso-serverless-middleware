// Original file: src/grpc/middleware.proto

import type { StatefulObjectBaseInformation as _miso_common_StatefulObjectBaseInformation, StatefulObjectBaseInformation__Output as _miso_common_StatefulObjectBaseInformation__Output } from '../../miso/common/StatefulObjectBaseInformation';
import type { CRDTSetType as _miso_common_CRDTSetType, CRDTSetType__Output as _miso_common_CRDTSetType__Output } from '../../miso/common/CRDTSetType';

export interface MapValueResponse {
  'statefulObjectBase'?: (_miso_common_StatefulObjectBaseInformation | null);
  'keyString'?: (string);
  'keyNumber'?: (number | string);
  'hasValue'?: (boolean);
  'valueCrdtName'?: (string);
  'valueCrdtType'?: (_miso_common_CRDTSetType);
  'key'?: "keyString"|"keyNumber";
  '_valueCrdtName'?: "valueCrdtName";
  '_valueCrdtType'?: "valueCrdtType";
}

export interface MapValueResponse__Output {
  'statefulObjectBase': (_miso_common_StatefulObjectBaseInformation__Output | null);
  'keyString'?: (string);
  'keyNumber'?: (number);
  'hasValue': (boolean);
  'valueCrdtName'?: (string);
  'valueCrdtType'?: (_miso_common_CRDTSetType__Output);
  'key': "keyString"|"keyNumber";
  '_valueCrdtName': "valueCrdtName";
  '_valueCrdtType': "valueCrdtType";
}
