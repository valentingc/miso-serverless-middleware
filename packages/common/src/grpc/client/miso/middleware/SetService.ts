// Original file: src/grpc/middleware.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { SetOrRegisterGetValueRequest as _miso_middleware_SetOrRegisterGetValueRequest, SetOrRegisterGetValueRequest__Output as _miso_middleware_SetOrRegisterGetValueRequest__Output } from '../../miso/middleware/SetOrRegisterGetValueRequest';
import type { SetOrRegisterSetValueRequest as _miso_middleware_SetOrRegisterSetValueRequest, SetOrRegisterSetValueRequest__Output as _miso_middleware_SetOrRegisterSetValueRequest__Output } from '../../miso/middleware/SetOrRegisterSetValueRequest';
import type { SetOrRegisterValueResponse as _miso_common_SetOrRegisterValueResponse, SetOrRegisterValueResponse__Output as _miso_common_SetOrRegisterValueResponse__Output } from '../../miso/common/SetOrRegisterValueResponse';

export interface SetServiceClient extends grpc.Client {
  Add(argument: _miso_middleware_SetOrRegisterSetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  Add(argument: _miso_middleware_SetOrRegisterSetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  Add(argument: _miso_middleware_SetOrRegisterSetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  Add(argument: _miso_middleware_SetOrRegisterSetValueRequest, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  add(argument: _miso_middleware_SetOrRegisterSetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  add(argument: _miso_middleware_SetOrRegisterSetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  add(argument: _miso_middleware_SetOrRegisterSetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  add(argument: _miso_middleware_SetOrRegisterSetValueRequest, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  
  GetValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _miso_middleware_SetOrRegisterGetValueRequest, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  
  RemoveORSet(argument: _miso_middleware_SetOrRegisterSetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  RemoveORSet(argument: _miso_middleware_SetOrRegisterSetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  RemoveORSet(argument: _miso_middleware_SetOrRegisterSetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  RemoveORSet(argument: _miso_middleware_SetOrRegisterSetValueRequest, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  removeOrSet(argument: _miso_middleware_SetOrRegisterSetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  removeOrSet(argument: _miso_middleware_SetOrRegisterSetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  removeOrSet(argument: _miso_middleware_SetOrRegisterSetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  removeOrSet(argument: _miso_middleware_SetOrRegisterSetValueRequest, callback: grpc.requestCallback<_miso_common_SetOrRegisterValueResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface SetServiceHandlers extends grpc.UntypedServiceImplementation {
  Add: grpc.handleUnaryCall<_miso_middleware_SetOrRegisterSetValueRequest__Output, _miso_common_SetOrRegisterValueResponse>;
  
  GetValue: grpc.handleUnaryCall<_miso_middleware_SetOrRegisterGetValueRequest__Output, _miso_common_SetOrRegisterValueResponse>;
  
  RemoveORSet: grpc.handleUnaryCall<_miso_middleware_SetOrRegisterSetValueRequest__Output, _miso_common_SetOrRegisterValueResponse>;
  
}

export interface SetServiceDefinition extends grpc.ServiceDefinition {
  Add: MethodDefinition<_miso_middleware_SetOrRegisterSetValueRequest, _miso_common_SetOrRegisterValueResponse, _miso_middleware_SetOrRegisterSetValueRequest__Output, _miso_common_SetOrRegisterValueResponse__Output>
  GetValue: MethodDefinition<_miso_middleware_SetOrRegisterGetValueRequest, _miso_common_SetOrRegisterValueResponse, _miso_middleware_SetOrRegisterGetValueRequest__Output, _miso_common_SetOrRegisterValueResponse__Output>
  RemoveORSet: MethodDefinition<_miso_middleware_SetOrRegisterSetValueRequest, _miso_common_SetOrRegisterValueResponse, _miso_middleware_SetOrRegisterSetValueRequest__Output, _miso_common_SetOrRegisterValueResponse__Output>
}
