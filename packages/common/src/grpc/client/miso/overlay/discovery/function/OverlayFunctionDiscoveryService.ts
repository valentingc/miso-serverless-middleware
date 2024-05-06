// Original file: src/grpc/discovery-function.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ServerlessFunctionFunctionInstanceMapResponse as _miso_overlay_discovery_function_ServerlessFunctionFunctionInstanceMapResponse, ServerlessFunctionFunctionInstanceMapResponse__Output as _miso_overlay_discovery_function_ServerlessFunctionFunctionInstanceMapResponse__Output } from '../../../../miso/overlay/discovery/function/ServerlessFunctionFunctionInstanceMapResponse';
import type { ServerlessFunctionPodInfoRequest as _miso_overlay_discovery_function_ServerlessFunctionPodInfoRequest, ServerlessFunctionPodInfoRequest__Output as _miso_overlay_discovery_function_ServerlessFunctionPodInfoRequest__Output } from '../../../../miso/overlay/discovery/function/ServerlessFunctionPodInfoRequest';
import type { ServerlessFunctionRegisterRequest as _miso_overlay_discovery_function_ServerlessFunctionRegisterRequest, ServerlessFunctionRegisterRequest__Output as _miso_overlay_discovery_function_ServerlessFunctionRegisterRequest__Output } from '../../../../miso/overlay/discovery/function/ServerlessFunctionRegisterRequest';
import type { ServerlessFunctionRegisterResponse as _miso_overlay_discovery_function_ServerlessFunctionRegisterResponse, ServerlessFunctionRegisterResponse__Output as _miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output } from '../../../../miso/overlay/discovery/function/ServerlessFunctionRegisterResponse';
import type { ServerlessFunctionUnregisterRequest as _miso_overlay_discovery_function_ServerlessFunctionUnregisterRequest, ServerlessFunctionUnregisterRequest__Output as _miso_overlay_discovery_function_ServerlessFunctionUnregisterRequest__Output } from '../../../../miso/overlay/discovery/function/ServerlessFunctionUnregisterRequest';
import type { Void as _miso_overlay_discovery_function_Void, Void__Output as _miso_overlay_discovery_function_Void__Output } from '../../../../miso/overlay/discovery/function/Void';

export interface OverlayFunctionDiscoveryServiceClient extends grpc.Client {
  exchangeMiddlewareServerlessFunctionPodInfo(argument: _miso_overlay_discovery_function_ServerlessFunctionPodInfoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_Void__Output>): grpc.ClientUnaryCall;
  exchangeMiddlewareServerlessFunctionPodInfo(argument: _miso_overlay_discovery_function_ServerlessFunctionPodInfoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_overlay_discovery_function_Void__Output>): grpc.ClientUnaryCall;
  exchangeMiddlewareServerlessFunctionPodInfo(argument: _miso_overlay_discovery_function_ServerlessFunctionPodInfoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_Void__Output>): grpc.ClientUnaryCall;
  exchangeMiddlewareServerlessFunctionPodInfo(argument: _miso_overlay_discovery_function_ServerlessFunctionPodInfoRequest, callback: grpc.requestCallback<_miso_overlay_discovery_function_Void__Output>): grpc.ClientUnaryCall;
  exchangeMiddlewareServerlessFunctionPodInfo(argument: _miso_overlay_discovery_function_ServerlessFunctionPodInfoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_Void__Output>): grpc.ClientUnaryCall;
  exchangeMiddlewareServerlessFunctionPodInfo(argument: _miso_overlay_discovery_function_ServerlessFunctionPodInfoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_overlay_discovery_function_Void__Output>): grpc.ClientUnaryCall;
  exchangeMiddlewareServerlessFunctionPodInfo(argument: _miso_overlay_discovery_function_ServerlessFunctionPodInfoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_Void__Output>): grpc.ClientUnaryCall;
  exchangeMiddlewareServerlessFunctionPodInfo(argument: _miso_overlay_discovery_function_ServerlessFunctionPodInfoRequest, callback: grpc.requestCallback<_miso_overlay_discovery_function_Void__Output>): grpc.ClientUnaryCall;
  
  getFunctionInstanceMap(argument: _miso_overlay_discovery_function_Void, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionFunctionInstanceMapResponse__Output>): grpc.ClientUnaryCall;
  getFunctionInstanceMap(argument: _miso_overlay_discovery_function_Void, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionFunctionInstanceMapResponse__Output>): grpc.ClientUnaryCall;
  getFunctionInstanceMap(argument: _miso_overlay_discovery_function_Void, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionFunctionInstanceMapResponse__Output>): grpc.ClientUnaryCall;
  getFunctionInstanceMap(argument: _miso_overlay_discovery_function_Void, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionFunctionInstanceMapResponse__Output>): grpc.ClientUnaryCall;
  getFunctionInstanceMap(argument: _miso_overlay_discovery_function_Void, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionFunctionInstanceMapResponse__Output>): grpc.ClientUnaryCall;
  getFunctionInstanceMap(argument: _miso_overlay_discovery_function_Void, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionFunctionInstanceMapResponse__Output>): grpc.ClientUnaryCall;
  getFunctionInstanceMap(argument: _miso_overlay_discovery_function_Void, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionFunctionInstanceMapResponse__Output>): grpc.ClientUnaryCall;
  getFunctionInstanceMap(argument: _miso_overlay_discovery_function_Void, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionFunctionInstanceMapResponse__Output>): grpc.ClientUnaryCall;
  
  registerServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionRegisterRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  registerServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionRegisterRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  registerServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionRegisterRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  registerServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionRegisterRequest, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  registerServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionRegisterRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  registerServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionRegisterRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  registerServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionRegisterRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  registerServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionRegisterRequest, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  
  unregisterServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionUnregisterRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  unregisterServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionUnregisterRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  unregisterServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionUnregisterRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  unregisterServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionUnregisterRequest, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  unregisterServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionUnregisterRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  unregisterServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionUnregisterRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  unregisterServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionUnregisterRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  unregisterServerlessFunction(argument: _miso_overlay_discovery_function_ServerlessFunctionUnregisterRequest, callback: grpc.requestCallback<_miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface OverlayFunctionDiscoveryServiceHandlers extends grpc.UntypedServiceImplementation {
  exchangeMiddlewareServerlessFunctionPodInfo: grpc.handleUnaryCall<_miso_overlay_discovery_function_ServerlessFunctionPodInfoRequest__Output, _miso_overlay_discovery_function_Void>;
  
  getFunctionInstanceMap: grpc.handleUnaryCall<_miso_overlay_discovery_function_Void__Output, _miso_overlay_discovery_function_ServerlessFunctionFunctionInstanceMapResponse>;
  
  registerServerlessFunction: grpc.handleUnaryCall<_miso_overlay_discovery_function_ServerlessFunctionRegisterRequest__Output, _miso_overlay_discovery_function_ServerlessFunctionRegisterResponse>;
  
  unregisterServerlessFunction: grpc.handleUnaryCall<_miso_overlay_discovery_function_ServerlessFunctionUnregisterRequest__Output, _miso_overlay_discovery_function_ServerlessFunctionRegisterResponse>;
  
}

export interface OverlayFunctionDiscoveryServiceDefinition extends grpc.ServiceDefinition {
  exchangeMiddlewareServerlessFunctionPodInfo: MethodDefinition<_miso_overlay_discovery_function_ServerlessFunctionPodInfoRequest, _miso_overlay_discovery_function_Void, _miso_overlay_discovery_function_ServerlessFunctionPodInfoRequest__Output, _miso_overlay_discovery_function_Void__Output>
  getFunctionInstanceMap: MethodDefinition<_miso_overlay_discovery_function_Void, _miso_overlay_discovery_function_ServerlessFunctionFunctionInstanceMapResponse, _miso_overlay_discovery_function_Void__Output, _miso_overlay_discovery_function_ServerlessFunctionFunctionInstanceMapResponse__Output>
  registerServerlessFunction: MethodDefinition<_miso_overlay_discovery_function_ServerlessFunctionRegisterRequest, _miso_overlay_discovery_function_ServerlessFunctionRegisterResponse, _miso_overlay_discovery_function_ServerlessFunctionRegisterRequest__Output, _miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>
  unregisterServerlessFunction: MethodDefinition<_miso_overlay_discovery_function_ServerlessFunctionUnregisterRequest, _miso_overlay_discovery_function_ServerlessFunctionRegisterResponse, _miso_overlay_discovery_function_ServerlessFunctionUnregisterRequest__Output, _miso_overlay_discovery_function_ServerlessFunctionRegisterResponse__Output>
}
