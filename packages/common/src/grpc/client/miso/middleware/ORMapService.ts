// Original file: src/grpc/middleware.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AckResponse as _miso_common_AckResponse, AckResponse__Output as _miso_common_AckResponse__Output } from '../../miso/common/AckResponse';
import type { BoolResponse as _miso_common_BoolResponse, BoolResponse__Output as _miso_common_BoolResponse__Output } from '../../miso/common/BoolResponse';
import type { MapClearValueRequest as _miso_middleware_MapClearValueRequest, MapClearValueRequest__Output as _miso_middleware_MapClearValueRequest__Output } from '../../miso/middleware/MapClearValueRequest';
import type { MapDeleteValueRequest as _miso_middleware_MapDeleteValueRequest, MapDeleteValueRequest__Output as _miso_middleware_MapDeleteValueRequest__Output } from '../../miso/middleware/MapDeleteValueRequest';
import type { MapGetKeysRequest as _miso_middleware_MapGetKeysRequest, MapGetKeysRequest__Output as _miso_middleware_MapGetKeysRequest__Output } from '../../miso/middleware/MapGetKeysRequest';
import type { MapGetKeysResponse as _miso_middleware_MapGetKeysResponse, MapGetKeysResponse__Output as _miso_middleware_MapGetKeysResponse__Output } from '../../miso/middleware/MapGetKeysResponse';
import type { MapGetValueRequest as _miso_middleware_MapGetValueRequest, MapGetValueRequest__Output as _miso_middleware_MapGetValueRequest__Output } from '../../miso/middleware/MapGetValueRequest';
import type { MapSetValueRequest as _miso_middleware_MapSetValueRequest, MapSetValueRequest__Output as _miso_middleware_MapSetValueRequest__Output } from '../../miso/middleware/MapSetValueRequest';
import type { MapValueResponse as _miso_middleware_MapValueResponse, MapValueResponse__Output as _miso_middleware_MapValueResponse__Output } from '../../miso/middleware/MapValueResponse';

export interface ORMapServiceClient extends grpc.Client {
  Clear(argument: _miso_middleware_MapClearValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  Clear(argument: _miso_middleware_MapClearValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  Clear(argument: _miso_middleware_MapClearValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  Clear(argument: _miso_middleware_MapClearValueRequest, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  clear(argument: _miso_middleware_MapClearValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  clear(argument: _miso_middleware_MapClearValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  clear(argument: _miso_middleware_MapClearValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  clear(argument: _miso_middleware_MapClearValueRequest, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  
  Get(argument: _miso_middleware_MapGetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  Get(argument: _miso_middleware_MapGetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  Get(argument: _miso_middleware_MapGetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  Get(argument: _miso_middleware_MapGetValueRequest, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  get(argument: _miso_middleware_MapGetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  get(argument: _miso_middleware_MapGetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  get(argument: _miso_middleware_MapGetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  get(argument: _miso_middleware_MapGetValueRequest, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  
  Has(argument: _miso_middleware_MapGetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  Has(argument: _miso_middleware_MapGetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  Has(argument: _miso_middleware_MapGetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  Has(argument: _miso_middleware_MapGetValueRequest, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  has(argument: _miso_middleware_MapGetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  has(argument: _miso_middleware_MapGetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  has(argument: _miso_middleware_MapGetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  has(argument: _miso_middleware_MapGetValueRequest, callback: grpc.requestCallback<_miso_common_BoolResponse__Output>): grpc.ClientUnaryCall;
  
  Keys(argument: _miso_middleware_MapGetKeysRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_middleware_MapGetKeysResponse__Output>): grpc.ClientUnaryCall;
  Keys(argument: _miso_middleware_MapGetKeysRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_middleware_MapGetKeysResponse__Output>): grpc.ClientUnaryCall;
  Keys(argument: _miso_middleware_MapGetKeysRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_middleware_MapGetKeysResponse__Output>): grpc.ClientUnaryCall;
  Keys(argument: _miso_middleware_MapGetKeysRequest, callback: grpc.requestCallback<_miso_middleware_MapGetKeysResponse__Output>): grpc.ClientUnaryCall;
  keys(argument: _miso_middleware_MapGetKeysRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_middleware_MapGetKeysResponse__Output>): grpc.ClientUnaryCall;
  keys(argument: _miso_middleware_MapGetKeysRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_middleware_MapGetKeysResponse__Output>): grpc.ClientUnaryCall;
  keys(argument: _miso_middleware_MapGetKeysRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_middleware_MapGetKeysResponse__Output>): grpc.ClientUnaryCall;
  keys(argument: _miso_middleware_MapGetKeysRequest, callback: grpc.requestCallback<_miso_middleware_MapGetKeysResponse__Output>): grpc.ClientUnaryCall;
  
  Remove(argument: _miso_middleware_MapDeleteValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  Remove(argument: _miso_middleware_MapDeleteValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  Remove(argument: _miso_middleware_MapDeleteValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  Remove(argument: _miso_middleware_MapDeleteValueRequest, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  remove(argument: _miso_middleware_MapDeleteValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  remove(argument: _miso_middleware_MapDeleteValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  remove(argument: _miso_middleware_MapDeleteValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  remove(argument: _miso_middleware_MapDeleteValueRequest, callback: grpc.requestCallback<_miso_common_AckResponse__Output>): grpc.ClientUnaryCall;
  
  Set(argument: _miso_middleware_MapSetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  Set(argument: _miso_middleware_MapSetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  Set(argument: _miso_middleware_MapSetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  Set(argument: _miso_middleware_MapSetValueRequest, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  set(argument: _miso_middleware_MapSetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  set(argument: _miso_middleware_MapSetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  set(argument: _miso_middleware_MapSetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  set(argument: _miso_middleware_MapSetValueRequest, callback: grpc.requestCallback<_miso_middleware_MapValueResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ORMapServiceHandlers extends grpc.UntypedServiceImplementation {
  Clear: grpc.handleUnaryCall<_miso_middleware_MapClearValueRequest__Output, _miso_common_AckResponse>;
  
  Get: grpc.handleUnaryCall<_miso_middleware_MapGetValueRequest__Output, _miso_middleware_MapValueResponse>;
  
  Has: grpc.handleUnaryCall<_miso_middleware_MapGetValueRequest__Output, _miso_common_BoolResponse>;
  
  Keys: grpc.handleUnaryCall<_miso_middleware_MapGetKeysRequest__Output, _miso_middleware_MapGetKeysResponse>;
  
  Remove: grpc.handleUnaryCall<_miso_middleware_MapDeleteValueRequest__Output, _miso_common_AckResponse>;
  
  Set: grpc.handleUnaryCall<_miso_middleware_MapSetValueRequest__Output, _miso_middleware_MapValueResponse>;
  
}

export interface ORMapServiceDefinition extends grpc.ServiceDefinition {
  Clear: MethodDefinition<_miso_middleware_MapClearValueRequest, _miso_common_AckResponse, _miso_middleware_MapClearValueRequest__Output, _miso_common_AckResponse__Output>
  Get: MethodDefinition<_miso_middleware_MapGetValueRequest, _miso_middleware_MapValueResponse, _miso_middleware_MapGetValueRequest__Output, _miso_middleware_MapValueResponse__Output>
  Has: MethodDefinition<_miso_middleware_MapGetValueRequest, _miso_common_BoolResponse, _miso_middleware_MapGetValueRequest__Output, _miso_common_BoolResponse__Output>
  Keys: MethodDefinition<_miso_middleware_MapGetKeysRequest, _miso_middleware_MapGetKeysResponse, _miso_middleware_MapGetKeysRequest__Output, _miso_middleware_MapGetKeysResponse__Output>
  Remove: MethodDefinition<_miso_middleware_MapDeleteValueRequest, _miso_common_AckResponse, _miso_middleware_MapDeleteValueRequest__Output, _miso_common_AckResponse__Output>
  Set: MethodDefinition<_miso_middleware_MapSetValueRequest, _miso_middleware_MapValueResponse, _miso_middleware_MapSetValueRequest__Output, _miso_middleware_MapValueResponse__Output>
}
