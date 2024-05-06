// Original file: src/grpc/replication.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CounterInitRequest as _miso_common_CounterInitRequest, CounterInitRequest__Output as _miso_common_CounterInitRequest__Output } from '../../miso/common/CounterInitRequest';
import type { CounterResponse as _miso_common_CounterResponse, CounterResponse__Output as _miso_common_CounterResponse__Output } from '../../miso/common/CounterResponse';
import type { EWFlagUpdate as _miso_replication_EWFlagUpdate, EWFlagUpdate__Output as _miso_replication_EWFlagUpdate__Output } from '../../miso/replication/EWFlagUpdate';
import type { FlagSetValueReponse as _miso_common_FlagSetValueReponse, FlagSetValueReponse__Output as _miso_common_FlagSetValueReponse__Output } from '../../miso/common/FlagSetValueReponse';
import type { GCounterUpdate as _miso_replication_GCounterUpdate, GCounterUpdate__Output as _miso_replication_GCounterUpdate__Output } from '../../miso/replication/GCounterUpdate';
import type { MVRegisterUpdate as _miso_replication_MVRegisterUpdate, MVRegisterUpdate__Output as _miso_replication_MVRegisterUpdate__Output } from '../../miso/replication/MVRegisterUpdate';
import type { ORSetUpdate as _miso_replication_ORSetUpdate, ORSetUpdate__Output as _miso_replication_ORSetUpdate__Output } from '../../miso/replication/ORSetUpdate';
import type { PNCounterUpdate as _miso_replication_PNCounterUpdate, PNCounterUpdate__Output as _miso_replication_PNCounterUpdate__Output } from '../../miso/replication/PNCounterUpdate';
import type { RetrieveEWFlagResponse as _miso_replication_RetrieveEWFlagResponse, RetrieveEWFlagResponse__Output as _miso_replication_RetrieveEWFlagResponse__Output } from '../../miso/replication/RetrieveEWFlagResponse';
import type { RetrieveGCounterResponse as _miso_replication_RetrieveGCounterResponse, RetrieveGCounterResponse__Output as _miso_replication_RetrieveGCounterResponse__Output } from '../../miso/replication/RetrieveGCounterResponse';
import type { RetrieveGSetResponse as _miso_replication_RetrieveGSetResponse, RetrieveGSetResponse__Output as _miso_replication_RetrieveGSetResponse__Output } from '../../miso/replication/RetrieveGSetResponse';
import type { RetrieveMVRegisterResponse as _miso_replication_RetrieveMVRegisterResponse, RetrieveMVRegisterResponse__Output as _miso_replication_RetrieveMVRegisterResponse__Output } from '../../miso/replication/RetrieveMVRegisterResponse';
import type { RetrieveORSetResponse as _miso_replication_RetrieveORSetResponse, RetrieveORSetResponse__Output as _miso_replication_RetrieveORSetResponse__Output } from '../../miso/replication/RetrieveORSetResponse';
import type { RetrievePNCounterResponse as _miso_replication_RetrievePNCounterResponse, RetrievePNCounterResponse__Output as _miso_replication_RetrievePNCounterResponse__Output } from '../../miso/replication/RetrievePNCounterResponse';
import type { SetInitRequest as _miso_common_SetInitRequest, SetInitRequest__Output as _miso_common_SetInitRequest__Output } from '../../miso/common/SetInitRequest';
import type { SetOrRegisterValueResponse as _miso_common_SetOrRegisterValueResponse, SetOrRegisterValueResponse__Output as _miso_common_SetOrRegisterValueResponse__Output } from '../../miso/common/SetOrRegisterValueResponse';

export interface ReplicationServiceClient extends grpc.Client {
  MergeEWFlag(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_EWFlagUpdate, _miso_common_FlagSetValueReponse__Output>;
  MergeEWFlag(options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_EWFlagUpdate, _miso_common_FlagSetValueReponse__Output>;
  mergeEwFlag(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_EWFlagUpdate, _miso_common_FlagSetValueReponse__Output>;
  mergeEwFlag(options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_EWFlagUpdate, _miso_common_FlagSetValueReponse__Output>;
  
  MergeGCounter(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_GCounterUpdate, _miso_common_CounterResponse__Output>;
  MergeGCounter(options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_GCounterUpdate, _miso_common_CounterResponse__Output>;
  mergeGCounter(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_GCounterUpdate, _miso_common_CounterResponse__Output>;
  mergeGCounter(options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_GCounterUpdate, _miso_common_CounterResponse__Output>;
  
  MergeGSet(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_MVRegisterUpdate, _miso_common_SetOrRegisterValueResponse__Output>;
  MergeGSet(options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_MVRegisterUpdate, _miso_common_SetOrRegisterValueResponse__Output>;
  mergeGSet(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_MVRegisterUpdate, _miso_common_SetOrRegisterValueResponse__Output>;
  mergeGSet(options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_MVRegisterUpdate, _miso_common_SetOrRegisterValueResponse__Output>;
  
  MergeMVRegister(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_MVRegisterUpdate, _miso_common_SetOrRegisterValueResponse__Output>;
  MergeMVRegister(options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_MVRegisterUpdate, _miso_common_SetOrRegisterValueResponse__Output>;
  mergeMvRegister(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_MVRegisterUpdate, _miso_common_SetOrRegisterValueResponse__Output>;
  mergeMvRegister(options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_MVRegisterUpdate, _miso_common_SetOrRegisterValueResponse__Output>;
  
  MergeORSet(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_ORSetUpdate, _miso_common_SetOrRegisterValueResponse__Output>;
  MergeORSet(options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_ORSetUpdate, _miso_common_SetOrRegisterValueResponse__Output>;
  mergeOrSet(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_ORSetUpdate, _miso_common_SetOrRegisterValueResponse__Output>;
  mergeOrSet(options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_ORSetUpdate, _miso_common_SetOrRegisterValueResponse__Output>;
  
  MergePNCounter(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_PNCounterUpdate, _miso_common_CounterResponse__Output>;
  MergePNCounter(options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_PNCounterUpdate, _miso_common_CounterResponse__Output>;
  mergePnCounter(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_PNCounterUpdate, _miso_common_CounterResponse__Output>;
  mergePnCounter(options?: grpc.CallOptions): grpc.ClientDuplexStream<_miso_replication_PNCounterUpdate, _miso_common_CounterResponse__Output>;
  
  RetrieveEWFlag(argument: _miso_common_CounterInitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveEWFlagResponse__Output>): grpc.ClientUnaryCall;
  RetrieveEWFlag(argument: _miso_common_CounterInitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_replication_RetrieveEWFlagResponse__Output>): grpc.ClientUnaryCall;
  RetrieveEWFlag(argument: _miso_common_CounterInitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveEWFlagResponse__Output>): grpc.ClientUnaryCall;
  RetrieveEWFlag(argument: _miso_common_CounterInitRequest, callback: grpc.requestCallback<_miso_replication_RetrieveEWFlagResponse__Output>): grpc.ClientUnaryCall;
  retrieveEwFlag(argument: _miso_common_CounterInitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveEWFlagResponse__Output>): grpc.ClientUnaryCall;
  retrieveEwFlag(argument: _miso_common_CounterInitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_replication_RetrieveEWFlagResponse__Output>): grpc.ClientUnaryCall;
  retrieveEwFlag(argument: _miso_common_CounterInitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveEWFlagResponse__Output>): grpc.ClientUnaryCall;
  retrieveEwFlag(argument: _miso_common_CounterInitRequest, callback: grpc.requestCallback<_miso_replication_RetrieveEWFlagResponse__Output>): grpc.ClientUnaryCall;
  
  RetrieveGCounter(argument: _miso_common_CounterInitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveGCounterResponse__Output>): grpc.ClientUnaryCall;
  RetrieveGCounter(argument: _miso_common_CounterInitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_replication_RetrieveGCounterResponse__Output>): grpc.ClientUnaryCall;
  RetrieveGCounter(argument: _miso_common_CounterInitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveGCounterResponse__Output>): grpc.ClientUnaryCall;
  RetrieveGCounter(argument: _miso_common_CounterInitRequest, callback: grpc.requestCallback<_miso_replication_RetrieveGCounterResponse__Output>): grpc.ClientUnaryCall;
  retrieveGCounter(argument: _miso_common_CounterInitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveGCounterResponse__Output>): grpc.ClientUnaryCall;
  retrieveGCounter(argument: _miso_common_CounterInitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_replication_RetrieveGCounterResponse__Output>): grpc.ClientUnaryCall;
  retrieveGCounter(argument: _miso_common_CounterInitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveGCounterResponse__Output>): grpc.ClientUnaryCall;
  retrieveGCounter(argument: _miso_common_CounterInitRequest, callback: grpc.requestCallback<_miso_replication_RetrieveGCounterResponse__Output>): grpc.ClientUnaryCall;
  
  RetrieveGSet(argument: _miso_common_SetInitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveGSetResponse__Output>): grpc.ClientUnaryCall;
  RetrieveGSet(argument: _miso_common_SetInitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_replication_RetrieveGSetResponse__Output>): grpc.ClientUnaryCall;
  RetrieveGSet(argument: _miso_common_SetInitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveGSetResponse__Output>): grpc.ClientUnaryCall;
  RetrieveGSet(argument: _miso_common_SetInitRequest, callback: grpc.requestCallback<_miso_replication_RetrieveGSetResponse__Output>): grpc.ClientUnaryCall;
  retrieveGSet(argument: _miso_common_SetInitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveGSetResponse__Output>): grpc.ClientUnaryCall;
  retrieveGSet(argument: _miso_common_SetInitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_replication_RetrieveGSetResponse__Output>): grpc.ClientUnaryCall;
  retrieveGSet(argument: _miso_common_SetInitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveGSetResponse__Output>): grpc.ClientUnaryCall;
  retrieveGSet(argument: _miso_common_SetInitRequest, callback: grpc.requestCallback<_miso_replication_RetrieveGSetResponse__Output>): grpc.ClientUnaryCall;
  
  RetrieveMVRegister(argument: _miso_common_SetInitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveMVRegisterResponse__Output>): grpc.ClientUnaryCall;
  RetrieveMVRegister(argument: _miso_common_SetInitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_replication_RetrieveMVRegisterResponse__Output>): grpc.ClientUnaryCall;
  RetrieveMVRegister(argument: _miso_common_SetInitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveMVRegisterResponse__Output>): grpc.ClientUnaryCall;
  RetrieveMVRegister(argument: _miso_common_SetInitRequest, callback: grpc.requestCallback<_miso_replication_RetrieveMVRegisterResponse__Output>): grpc.ClientUnaryCall;
  retrieveMvRegister(argument: _miso_common_SetInitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveMVRegisterResponse__Output>): grpc.ClientUnaryCall;
  retrieveMvRegister(argument: _miso_common_SetInitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_replication_RetrieveMVRegisterResponse__Output>): grpc.ClientUnaryCall;
  retrieveMvRegister(argument: _miso_common_SetInitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveMVRegisterResponse__Output>): grpc.ClientUnaryCall;
  retrieveMvRegister(argument: _miso_common_SetInitRequest, callback: grpc.requestCallback<_miso_replication_RetrieveMVRegisterResponse__Output>): grpc.ClientUnaryCall;
  
  RetrieveORSet(argument: _miso_common_SetInitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveORSetResponse__Output>): grpc.ClientUnaryCall;
  RetrieveORSet(argument: _miso_common_SetInitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_replication_RetrieveORSetResponse__Output>): grpc.ClientUnaryCall;
  RetrieveORSet(argument: _miso_common_SetInitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveORSetResponse__Output>): grpc.ClientUnaryCall;
  RetrieveORSet(argument: _miso_common_SetInitRequest, callback: grpc.requestCallback<_miso_replication_RetrieveORSetResponse__Output>): grpc.ClientUnaryCall;
  retrieveOrSet(argument: _miso_common_SetInitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveORSetResponse__Output>): grpc.ClientUnaryCall;
  retrieveOrSet(argument: _miso_common_SetInitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_replication_RetrieveORSetResponse__Output>): grpc.ClientUnaryCall;
  retrieveOrSet(argument: _miso_common_SetInitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrieveORSetResponse__Output>): grpc.ClientUnaryCall;
  retrieveOrSet(argument: _miso_common_SetInitRequest, callback: grpc.requestCallback<_miso_replication_RetrieveORSetResponse__Output>): grpc.ClientUnaryCall;
  
  RetrievePNCounter(argument: _miso_common_CounterInitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrievePNCounterResponse__Output>): grpc.ClientUnaryCall;
  RetrievePNCounter(argument: _miso_common_CounterInitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_replication_RetrievePNCounterResponse__Output>): grpc.ClientUnaryCall;
  RetrievePNCounter(argument: _miso_common_CounterInitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrievePNCounterResponse__Output>): grpc.ClientUnaryCall;
  RetrievePNCounter(argument: _miso_common_CounterInitRequest, callback: grpc.requestCallback<_miso_replication_RetrievePNCounterResponse__Output>): grpc.ClientUnaryCall;
  retrievePnCounter(argument: _miso_common_CounterInitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrievePNCounterResponse__Output>): grpc.ClientUnaryCall;
  retrievePnCounter(argument: _miso_common_CounterInitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_replication_RetrievePNCounterResponse__Output>): grpc.ClientUnaryCall;
  retrievePnCounter(argument: _miso_common_CounterInitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_replication_RetrievePNCounterResponse__Output>): grpc.ClientUnaryCall;
  retrievePnCounter(argument: _miso_common_CounterInitRequest, callback: grpc.requestCallback<_miso_replication_RetrievePNCounterResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ReplicationServiceHandlers extends grpc.UntypedServiceImplementation {
  MergeEWFlag: grpc.handleBidiStreamingCall<_miso_replication_EWFlagUpdate__Output, _miso_common_FlagSetValueReponse>;
  
  MergeGCounter: grpc.handleBidiStreamingCall<_miso_replication_GCounterUpdate__Output, _miso_common_CounterResponse>;
  
  MergeGSet: grpc.handleBidiStreamingCall<_miso_replication_MVRegisterUpdate__Output, _miso_common_SetOrRegisterValueResponse>;
  
  MergeMVRegister: grpc.handleBidiStreamingCall<_miso_replication_MVRegisterUpdate__Output, _miso_common_SetOrRegisterValueResponse>;
  
  MergeORSet: grpc.handleBidiStreamingCall<_miso_replication_ORSetUpdate__Output, _miso_common_SetOrRegisterValueResponse>;
  
  MergePNCounter: grpc.handleBidiStreamingCall<_miso_replication_PNCounterUpdate__Output, _miso_common_CounterResponse>;
  
  RetrieveEWFlag: grpc.handleUnaryCall<_miso_common_CounterInitRequest__Output, _miso_replication_RetrieveEWFlagResponse>;
  
  RetrieveGCounter: grpc.handleUnaryCall<_miso_common_CounterInitRequest__Output, _miso_replication_RetrieveGCounterResponse>;
  
  RetrieveGSet: grpc.handleUnaryCall<_miso_common_SetInitRequest__Output, _miso_replication_RetrieveGSetResponse>;
  
  RetrieveMVRegister: grpc.handleUnaryCall<_miso_common_SetInitRequest__Output, _miso_replication_RetrieveMVRegisterResponse>;
  
  RetrieveORSet: grpc.handleUnaryCall<_miso_common_SetInitRequest__Output, _miso_replication_RetrieveORSetResponse>;
  
  RetrievePNCounter: grpc.handleUnaryCall<_miso_common_CounterInitRequest__Output, _miso_replication_RetrievePNCounterResponse>;
  
}

export interface ReplicationServiceDefinition extends grpc.ServiceDefinition {
  MergeEWFlag: MethodDefinition<_miso_replication_EWFlagUpdate, _miso_common_FlagSetValueReponse, _miso_replication_EWFlagUpdate__Output, _miso_common_FlagSetValueReponse__Output>
  MergeGCounter: MethodDefinition<_miso_replication_GCounterUpdate, _miso_common_CounterResponse, _miso_replication_GCounterUpdate__Output, _miso_common_CounterResponse__Output>
  MergeGSet: MethodDefinition<_miso_replication_MVRegisterUpdate, _miso_common_SetOrRegisterValueResponse, _miso_replication_MVRegisterUpdate__Output, _miso_common_SetOrRegisterValueResponse__Output>
  MergeMVRegister: MethodDefinition<_miso_replication_MVRegisterUpdate, _miso_common_SetOrRegisterValueResponse, _miso_replication_MVRegisterUpdate__Output, _miso_common_SetOrRegisterValueResponse__Output>
  MergeORSet: MethodDefinition<_miso_replication_ORSetUpdate, _miso_common_SetOrRegisterValueResponse, _miso_replication_ORSetUpdate__Output, _miso_common_SetOrRegisterValueResponse__Output>
  MergePNCounter: MethodDefinition<_miso_replication_PNCounterUpdate, _miso_common_CounterResponse, _miso_replication_PNCounterUpdate__Output, _miso_common_CounterResponse__Output>
  RetrieveEWFlag: MethodDefinition<_miso_common_CounterInitRequest, _miso_replication_RetrieveEWFlagResponse, _miso_common_CounterInitRequest__Output, _miso_replication_RetrieveEWFlagResponse__Output>
  RetrieveGCounter: MethodDefinition<_miso_common_CounterInitRequest, _miso_replication_RetrieveGCounterResponse, _miso_common_CounterInitRequest__Output, _miso_replication_RetrieveGCounterResponse__Output>
  RetrieveGSet: MethodDefinition<_miso_common_SetInitRequest, _miso_replication_RetrieveGSetResponse, _miso_common_SetInitRequest__Output, _miso_replication_RetrieveGSetResponse__Output>
  RetrieveMVRegister: MethodDefinition<_miso_common_SetInitRequest, _miso_replication_RetrieveMVRegisterResponse, _miso_common_SetInitRequest__Output, _miso_replication_RetrieveMVRegisterResponse__Output>
  RetrieveORSet: MethodDefinition<_miso_common_SetInitRequest, _miso_replication_RetrieveORSetResponse, _miso_common_SetInitRequest__Output, _miso_replication_RetrieveORSetResponse__Output>
  RetrievePNCounter: MethodDefinition<_miso_common_CounterInitRequest, _miso_replication_RetrievePNCounterResponse, _miso_common_CounterInitRequest__Output, _miso_replication_RetrievePNCounterResponse__Output>
}
