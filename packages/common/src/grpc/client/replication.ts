import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { ReplicationServiceClient as _miso_replication_ReplicationServiceClient, ReplicationServiceDefinition as _miso_replication_ReplicationServiceDefinition } from './miso/replication/ReplicationService';

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
    replication: {
      EWFlagUpdate: MessageTypeDefinition
      GCounterUpdate: MessageTypeDefinition
      MVRegisterUpdate: MessageTypeDefinition
      ORMapUpdate: MessageTypeDefinition
      ORMapUpdateEntry: MessageTypeDefinition
      ORSetUpdate: MessageTypeDefinition
      PNCounterUpdate: MessageTypeDefinition
      ReplicationService: SubtypeConstructor<typeof grpc.Client, _miso_replication_ReplicationServiceClient> & { service: _miso_replication_ReplicationServiceDefinition }
      RetrieveEWFlagResponse: MessageTypeDefinition
      RetrieveGCounterResponse: MessageTypeDefinition
      RetrieveGSetResponse: MessageTypeDefinition
      RetrieveMVRegisterResponse: MessageTypeDefinition
      RetrieveORSetResponse: MessageTypeDefinition
      RetrievePNCounterResponse: MessageTypeDefinition
    }
  }
}

