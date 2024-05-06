import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';


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
  }
}

