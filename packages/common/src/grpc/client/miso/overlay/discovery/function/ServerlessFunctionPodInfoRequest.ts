// Original file: src/grpc/discovery-function.proto

import type { ServerlessFunctionPodInfoMapValue as _miso_overlay_discovery_function_ServerlessFunctionPodInfoMapValue, ServerlessFunctionPodInfoMapValue__Output as _miso_overlay_discovery_function_ServerlessFunctionPodInfoMapValue__Output } from '../../../../miso/overlay/discovery/function/ServerlessFunctionPodInfoMapValue';
import type { ServerlessFunctionPodInfoRequestType as _miso_overlay_discovery_function_ServerlessFunctionPodInfoRequestType, ServerlessFunctionPodInfoRequestType__Output as _miso_overlay_discovery_function_ServerlessFunctionPodInfoRequestType__Output } from '../../../../miso/overlay/discovery/function/ServerlessFunctionPodInfoRequestType';

export interface ServerlessFunctionPodInfoRequest {
  'serverlessFunctionPods'?: ({[key: string]: _miso_overlay_discovery_function_ServerlessFunctionPodInfoMapValue});
  'srcMiddlewarePodName'?: (string);
  'srcMiddlewareNodeName'?: (string);
  'srcMiddlewareNodeIp'?: (string);
  'requestType'?: (_miso_overlay_discovery_function_ServerlessFunctionPodInfoRequestType);
  'firstInstanceofFunction'?: (boolean);
}

export interface ServerlessFunctionPodInfoRequest__Output {
  'serverlessFunctionPods': ({[key: string]: _miso_overlay_discovery_function_ServerlessFunctionPodInfoMapValue__Output});
  'srcMiddlewarePodName': (string);
  'srcMiddlewareNodeName': (string);
  'srcMiddlewareNodeIp': (string);
  'requestType': (_miso_overlay_discovery_function_ServerlessFunctionPodInfoRequestType__Output);
  'firstInstanceofFunction': (boolean);
}
