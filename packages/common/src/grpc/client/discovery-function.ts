import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { OverlayFunctionDiscoveryServiceClient as _miso_overlay_discovery_function_OverlayFunctionDiscoveryServiceClient, OverlayFunctionDiscoveryServiceDefinition as _miso_overlay_discovery_function_OverlayFunctionDiscoveryServiceDefinition } from './miso/overlay/discovery/function/OverlayFunctionDiscoveryService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      ListValue: MessageTypeDefinition
      NullValue: EnumTypeDefinition
      Struct: MessageTypeDefinition
      Timestamp: MessageTypeDefinition
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
        function: {
          OverlayFunctionDiscoveryService: SubtypeConstructor<typeof grpc.Client, _miso_overlay_discovery_function_OverlayFunctionDiscoveryServiceClient> & { service: _miso_overlay_discovery_function_OverlayFunctionDiscoveryServiceDefinition }
          ServerlessFunctionFunctionInstanceMapResponeItem: MessageTypeDefinition
          ServerlessFunctionFunctionInstanceMapResponse: MessageTypeDefinition
          ServerlessFunctionInstance: MessageTypeDefinition
          ServerlessFunctionPodInfoMapValue: MessageTypeDefinition
          ServerlessFunctionPodInfoMapValueItem: MessageTypeDefinition
          ServerlessFunctionPodInfoRequest: MessageTypeDefinition
          ServerlessFunctionPodInfoRequestType: EnumTypeDefinition
          ServerlessFunctionRegisterRequest: MessageTypeDefinition
          ServerlessFunctionRegisterResponse: MessageTypeDefinition
          ServerlessFunctionUnregisterRequest: MessageTypeDefinition
          Void: MessageTypeDefinition
        }
      }
    }
  }
}

