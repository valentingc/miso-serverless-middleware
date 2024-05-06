// Original file: src/grpc/discovery-node.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { OverlayNodeDiscoveryHeartbeatRequest as _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, OverlayNodeDiscoveryHeartbeatRequest__Output as _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest__Output } from '../../../../miso/overlay/discovery/node/OverlayNodeDiscoveryHeartbeatRequest';
import type { OverlayNodeDiscoveryHeartbeatResponse as _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatResponse, OverlayNodeDiscoveryHeartbeatResponse__Output as _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatResponse__Output } from '../../../../miso/overlay/discovery/node/OverlayNodeDiscoveryHeartbeatResponse';
import type { Void as _miso_common_Void, Void__Output as _miso_common_Void__Output } from '../../../../miso/common/Void';

export interface OverlayNodeDiscoveryServiceClient extends grpc.Client {
  heartbeat(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatResponse__Output>): grpc.ClientUnaryCall;
  heartbeat(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatResponse__Output>): grpc.ClientUnaryCall;
  heartbeat(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatResponse__Output>): grpc.ClientUnaryCall;
  heartbeat(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, callback: grpc.requestCallback<_miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatResponse__Output>): grpc.ClientUnaryCall;
  heartbeat(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatResponse__Output>): grpc.ClientUnaryCall;
  heartbeat(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatResponse__Output>): grpc.ClientUnaryCall;
  heartbeat(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatResponse__Output>): grpc.ClientUnaryCall;
  heartbeat(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, callback: grpc.requestCallback<_miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatResponse__Output>): grpc.ClientUnaryCall;
  
  init(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_Void__Output>): grpc.ClientUnaryCall;
  init(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_Void__Output>): grpc.ClientUnaryCall;
  init(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_Void__Output>): grpc.ClientUnaryCall;
  init(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, callback: grpc.requestCallback<_miso_common_Void__Output>): grpc.ClientUnaryCall;
  init(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_Void__Output>): grpc.ClientUnaryCall;
  init(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_miso_common_Void__Output>): grpc.ClientUnaryCall;
  init(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_miso_common_Void__Output>): grpc.ClientUnaryCall;
  init(argument: _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, callback: grpc.requestCallback<_miso_common_Void__Output>): grpc.ClientUnaryCall;
  
}

export interface OverlayNodeDiscoveryServiceHandlers extends grpc.UntypedServiceImplementation {
  heartbeat: grpc.handleUnaryCall<_miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest__Output, _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatResponse>;
  
  init: grpc.handleUnaryCall<_miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest__Output, _miso_common_Void>;
  
}

export interface OverlayNodeDiscoveryServiceDefinition extends grpc.ServiceDefinition {
  heartbeat: MethodDefinition<_miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatResponse, _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest__Output, _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatResponse__Output>
  init: MethodDefinition<_miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest, _miso_common_Void, _miso_overlay_discovery_node_OverlayNodeDiscoveryHeartbeatRequest__Output, _miso_common_Void__Output>
}
