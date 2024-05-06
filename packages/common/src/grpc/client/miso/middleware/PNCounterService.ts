// Original file: src/grpc/middleware.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CounterAddOrSubtractValueRequest as _miso_middleware_CounterAddOrSubtractValueRequest, CounterAddOrSubtractValueRequest__Output as _miso_middleware_CounterAddOrSubtractValueRequest__Output } from '../../miso/middleware/CounterAddOrSubtractValueRequest';
import type { CounterGetValueRequest as _miso_middleware_CounterGetValueRequest, CounterGetValueRequest__Output as _miso_middleware_CounterGetValueRequest__Output } from '../../miso/middleware/CounterGetValueRequest';
import type { CounterResponse as _miso_common_CounterResponse, CounterResponse__Output as _miso_common_CounterResponse__Output } from '../../miso/common/CounterResponse';

export interface PNCounterServiceClient extends grpc.Client {
  Add(argument: _miso_middleware_CounterAddOrSubtractValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  Add(argument: _miso_middleware_CounterAddOrSubtractValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  Add(argument: _miso_middleware_CounterAddOrSubtractValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  Add(argument: _miso_middleware_CounterAddOrSubtractValueRequest, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  add(argument: _miso_middleware_CounterAddOrSubtractValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  add(argument: _miso_middleware_CounterAddOrSubtractValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  add(argument: _miso_middleware_CounterAddOrSubtractValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  add(argument: _miso_middleware_CounterAddOrSubtractValueRequest, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  
  GetValue(argument: _miso_middleware_CounterGetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _miso_middleware_CounterGetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _miso_middleware_CounterGetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _miso_middleware_CounterGetValueRequest, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_CounterGetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_CounterGetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_CounterGetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_CounterGetValueRequest, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  
  Subtract(argument: _miso_middleware_CounterAddOrSubtractValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  Subtract(argument: _miso_middleware_CounterAddOrSubtractValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  Subtract(argument: _miso_middleware_CounterAddOrSubtractValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  Subtract(argument: _miso_middleware_CounterAddOrSubtractValueRequest, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  subtract(argument: _miso_middleware_CounterAddOrSubtractValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  subtract(argument: _miso_middleware_CounterAddOrSubtractValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  subtract(argument: _miso_middleware_CounterAddOrSubtractValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  subtract(argument: _miso_middleware_CounterAddOrSubtractValueRequest, callback: grpc.requestCallback<_miso_common_CounterResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface PNCounterServiceHandlers extends grpc.UntypedServiceImplementation {
  Add: grpc.handleUnaryCall<_miso_middleware_CounterAddOrSubtractValueRequest__Output, _miso_common_CounterResponse>;
  
  GetValue: grpc.handleUnaryCall<_miso_middleware_CounterGetValueRequest__Output, _miso_common_CounterResponse>;
  
  Subtract: grpc.handleUnaryCall<_miso_middleware_CounterAddOrSubtractValueRequest__Output, _miso_common_CounterResponse>;
  
}

export interface PNCounterServiceDefinition extends grpc.ServiceDefinition {
  Add: MethodDefinition<_miso_middleware_CounterAddOrSubtractValueRequest, _miso_common_CounterResponse, _miso_middleware_CounterAddOrSubtractValueRequest__Output, _miso_common_CounterResponse__Output>
  GetValue: MethodDefinition<_miso_middleware_CounterGetValueRequest, _miso_common_CounterResponse, _miso_middleware_CounterGetValueRequest__Output, _miso_common_CounterResponse__Output>
  Subtract: MethodDefinition<_miso_middleware_CounterAddOrSubtractValueRequest, _miso_common_CounterResponse, _miso_middleware_CounterAddOrSubtractValueRequest__Output, _miso_common_CounterResponse__Output>
}
