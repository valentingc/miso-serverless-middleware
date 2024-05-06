import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { EWFlagServiceClient as _miso_middleware_EWFlagServiceClient, EWFlagServiceDefinition as _miso_middleware_EWFlagServiceDefinition } from './miso/middleware/EWFlagService';
import type { GCounterServiceClient as _miso_middleware_GCounterServiceClient, GCounterServiceDefinition as _miso_middleware_GCounterServiceDefinition } from './miso/middleware/GCounterService';
import type { MVRegisterServiceClient as _miso_middleware_MVRegisterServiceClient, MVRegisterServiceDefinition as _miso_middleware_MVRegisterServiceDefinition } from './miso/middleware/MVRegisterService';
import type { ORMapServiceClient as _miso_middleware_ORMapServiceClient, ORMapServiceDefinition as _miso_middleware_ORMapServiceDefinition } from './miso/middleware/ORMapService';
import type { PNCounterServiceClient as _miso_middleware_PNCounterServiceClient, PNCounterServiceDefinition as _miso_middleware_PNCounterServiceDefinition } from './miso/middleware/PNCounterService';
import type { SetServiceClient as _miso_middleware_SetServiceClient, SetServiceDefinition as _miso_middleware_SetServiceDefinition } from './miso/middleware/SetService';
import type { StatefulObjectServiceClient as _miso_middleware_StatefulObjectServiceClient, StatefulObjectServiceDefinition as _miso_middleware_StatefulObjectServiceDefinition } from './miso/middleware/StatefulObjectService';

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
    middleware: {
      CounterAddOrSubtractValueRequest: MessageTypeDefinition
      CounterGetValueRequest: MessageTypeDefinition
      DeleteCrdtRequest: MessageTypeDefinition
      EWFlagService: SubtypeConstructor<typeof grpc.Client, _miso_middleware_EWFlagServiceClient> & { service: _miso_middleware_EWFlagServiceDefinition }
      FlagSetValueRequest: MessageTypeDefinition
      GCounterService: SubtypeConstructor<typeof grpc.Client, _miso_middleware_GCounterServiceClient> & { service: _miso_middleware_GCounterServiceDefinition }
      MVRegisterService: SubtypeConstructor<typeof grpc.Client, _miso_middleware_MVRegisterServiceClient> & { service: _miso_middleware_MVRegisterServiceDefinition }
      MapClearValueRequest: MessageTypeDefinition
      MapDeleteValueRequest: MessageTypeDefinition
      MapGetKeysRequest: MessageTypeDefinition
      MapGetKeysResponse: MessageTypeDefinition
      MapGetValueRequest: MessageTypeDefinition
      MapSetValueRequest: MessageTypeDefinition
      MapValueResponse: MessageTypeDefinition
      ORMapService: SubtypeConstructor<typeof grpc.Client, _miso_middleware_ORMapServiceClient> & { service: _miso_middleware_ORMapServiceDefinition }
      PNCounterService: SubtypeConstructor<typeof grpc.Client, _miso_middleware_PNCounterServiceClient> & { service: _miso_middleware_PNCounterServiceDefinition }
      SetOrRegisterGetValueRequest: MessageTypeDefinition
      SetOrRegisterSetValueRequest: MessageTypeDefinition
      SetService: SubtypeConstructor<typeof grpc.Client, _miso_middleware_SetServiceClient> & { service: _miso_middleware_SetServiceDefinition }
      StatefulObjectService: SubtypeConstructor<typeof grpc.Client, _miso_middleware_StatefulObjectServiceClient> & { service: _miso_middleware_StatefulObjectServiceDefinition }
    }
  }
}

