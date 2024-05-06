// Original file: src/grpc/middleware.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { SetOrRegisterGetValueRequest as _miso_middleware_SetOrRegisterGetValueRequest, SetOrRegisterGetValueRequest__Output as _miso_middleware_SetOrRegisterGetValueRequest__Output } from '../../miso/middleware/SetOrRegisterGetValueRequest';
import type { SetOrRegisterSetValueRequest as _miso_middleware_SetOrRegisterSetValueRequest, SetOrRegisterSetValueRequest__Output as _miso_middleware_SetOrRegisterSetValueRequest__Output } from '../../miso/middleware/SetOrRegisterSetValueRequest';
import type { SetOrRegisterValueResponse as _miso_common_SetOrRegisterValueResponse, SetOrRegisterValueResponse__Output as _miso_common_SetOrRegisterValueResponse__Output } from '../../miso/common/SetOrRegisterValueResponse';

export interface MVRegisterServiceClient extends grpc.Client {
  Assign(argument: _miso_middleware_SetOrRegisterSetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  Assign(argument: _miso_middleware_SetOrRegisterSetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  Assign(argument: _miso_middleware_SetOrRegisterSetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  Assign(argument: _miso_middleware_SetOrRegisterSetValueRequest, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  assign(argument: _miso_middleware_SetOrRegisterSetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  assign(argument: _miso_middleware_SetOrRegisterSetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  assign(argument: _miso_middleware_SetOrRegisterSetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  assign(argument: _miso_middleware_SetOrRegisterSetValueRequest, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  
  GetValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface MVRegisterServiceHandlers extends grpc.UntypedServiceImplementation {
  Assign: grpc.handleUnaryCall<_miso_middleware_SetOrRegisterSetValueRequest__Output, _miso_common_SetOrRegisterValueResponse>;
  
  GetValue: grpc.handleUnaryCall<_miso_middleware_SetOrRegisterGetValueRequest__Output, _miso_common_SetOrRegisterValueResponse>;
  
}

export interface MVRegisterServiceDefinition extends grpc.ServiceDefinition {
  Assign: MethodDefinition<_miso_middleware_SetOrRegisterSetValueRequest, _miso_common_SetOrRegisterValueResponse, _miso_middleware_SetOrRegisterSetValueRequest__Output, _miso_common_SetOrRegisterValueResponse__Output>
  GetValue: MethodDefinition<_miso_middleware_SetOrRegisterGetValueRequest, _miso_common_SetOrRegisterValueResponse, _miso_middleware_SetOrRegisterGetValueRequest__Output, _miso_common_SetOrRegisterValueResponse__Output>
}
