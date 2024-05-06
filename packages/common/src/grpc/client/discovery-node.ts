import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { OverlayNodeDiscoveryServiceClient as _miso_overlay_discovery_node_OverlayNodeDiscoveryServiceClient, OverlayNodeDiscoveryServiceDefinition as _miso_overlay_discovery_node_OverlayNodeDiscoveryServiceDefinition } from './miso/overlay/discovery/node/OverlayNodeDiscoveryService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      ListValue: MessageTypeDefinition
      NullValue: EnumTypeDefinition
      Struct: MessageTypeDefinition
      Value: MessageTypeDefinition
    }
  }
  miso: {
    common: {
      AckResponse: MessageTypeDefinition
      BoolResponse: MessageTypeDefinition
      CRDTSetType: EnumTypeDefinition
      CausalCrdtVectorClock: MessageTypeDefinition
      CounterInitRequest: MessageTypeDefinition
      CounterResponse: MessageTypeDefinition
      FlagSetValueReponse: MessageTypeDefinition
      ReplicaVersion: MessageTypeDefinition
      ServerlessFunctionBaseInformation: MessageTypeDefinition
      SetGenericType: EnumTypeDefinition
      SetInitRequest: MessageTypeDefinition
      SetOrRegisterValueResponse: MessageTypeDefinition
      SetOrRegisterValueResponseNumberValues: MessageTypeDefinition
      SetOrRegisterValueResponseObjectValues: MessageTypeDefinition
      SetOrRegisterValueResponseStringValues: MessageTypeDefinition
      StatefulObjectBaseInformation: MessageTypeDefinition
      Void: MessageTypeDefinition
    }
    overlay: {
      discovery: {
        node: {
          OverlayNodeDiscoveryHeartbeatRequest: MessageTypeDefinition
          OverlayNodeDiscoveryHeartbeatResponse: MessageTypeDefinition
          OverlayNodeDiscoveryService: SubtypeConstructor<typeof grpc.Client, _miso_overlay_discovery_node_OverlayNodeDiscoveryServiceClient> & { service: _miso_overlay_discovery_node_OverlayNodeDiscoveryServiceDefinition }
        }
      }
    }
  }
}

