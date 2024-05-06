// Original file: src/grpc/middleware.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BoolResponse as _miso_common_BoolResponse, BoolResponse__Output as _miso_common_BoolResponse__Output } from '../../miso/common/BoolResponse';
import type { DeleteCrdtRequest as _miso_middleware_DeleteCrdtRequest, DeleteCrdtRequest__Output as _miso_middleware_DeleteCrdtRequest__Output } from '../../miso/middleware/DeleteCrdtRequest';

export interface StatefulObjectServiceClient extends grpc.Client {
  Remove(argument: _miso_middleware_DeleteCrdtRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  Remove(argument: _miso_middleware_DeleteCrdtRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  Remove(argument: _miso_middleware_DeleteCrdtRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  Remove(argument: _miso_middleware_DeleteCrdtRequest, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  remove(argument: _miso_middleware_DeleteCrdtRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  remove(argument: _miso_middleware_DeleteCrdtRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  remove(argument: _miso_middleware_DeleteCrdtRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  remove(argument: _miso_middleware_DeleteCrdtRequest, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface StatefulObjectServiceHandlers extends grpc.UntypedServiceImplementation {
  Remove: grpc.handleUnaryCall<_miso_middleware_DeleteCrdtRequest__Output, _miso_common_BoolResponse>;
  
}

export interface StatefulObjectServiceDefinition extends grpc.ServiceDefinition {
  Remove: MethodDefinition<_miso_middleware_DeleteCrdtRequest, _miso_common_BoolResponse, _miso_middleware_DeleteCrdtRequest__Output, _miso_common_BoolResponse__Output>
}
