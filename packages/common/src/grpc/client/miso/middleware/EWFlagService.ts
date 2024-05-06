// Original file: src/grpc/middleware.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CounterGetValueRequest as _miso_middleware_CounterGetValueRequest, CounterGetValueRequest__Output as _miso_middleware_CounterGetValueRequest__Output } from '../../miso/middleware/CounterGetValueRequest';
import type { FlagSetValueReponse as _miso_common_FlagSetValueReponse, FlagSetValueReponse__Output as _miso_common_FlagSetValueReponse__Output } from '../../miso/common/FlagSetValueReponse';
import type { FlagSetValueRequest as _miso_middleware_FlagSetValueRequest, FlagSetValueRequest__Output as _miso_middleware_FlagSetValueRequest__Output } from '../../miso/middleware/FlagSetValueRequest';

export interface EWFlagServiceClient extends grpc.Client {
  Assign(argument: _miso_middleware_FlagSetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  Assign(argument: _miso_middleware_FlagSetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  Assign(argument: _miso_middleware_FlagSetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  Assign(argument: _miso_middleware_FlagSetValueRequest, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  assign(argument: _miso_middleware_FlagSetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  assign(argument: _miso_middleware_FlagSetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  assign(argument: _miso_middleware_FlagSetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  assign(argument: _miso_middleware_FlagSetValueRequest, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  
  GetValue(argument: _miso_middleware_CounterGetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _miso_middleware_CounterGetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _miso_middleware_CounterGetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _miso_middleware_CounterGetValueRequest, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_CounterGetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_CounterGetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_CounterGetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_CounterGetValueRequest, callback: grpc.requestCallback<_miso_common_FlagSetValueReponse__Output>): grpc.ClientUnaryCall;
  
}

export interface EWFlagServiceHandlers extends grpc.UntypedServiceImplementation {
  Assign: grpc.handleUnaryCall<_miso_middleware_FlagSetValueRequest__Output, _miso_common_FlagSetValueReponse>;
  
  GetValue: grpc.handleUnaryCall<_miso_middleware_CounterGetValueRequest__Output, _miso_common_FlagSetValueReponse>;
  
}

export interface EWFlagServiceDefinition extends grpc.ServiceDefinition {
  Assign: MethodDefinition<_miso_middleware_FlagSetValueRequest, _miso_common_FlagSetValueReponse, _miso_middleware_FlagSetValueRequest__Output, _miso_common_FlagSetValueReponse__Output>
  GetValue: MethodDefinition<_miso_middleware_CounterGetValueRequest, _miso_common_FlagSetValueReponse, _miso_middleware_CounterGetValueRequest__Output, _miso_common_FlagSetValueReponse__Output>
}
