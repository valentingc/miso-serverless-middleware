import { Module } from '@nestjs/common';
import { ObjectsModule } from '../objects/objects.module.js';
import { GrpcTransportModule } from '../overlay-network/transports/grpc/grpc-transport.module.js';
import { ReplicationModule } from '../replication/replication.module.js';
import { UtilsModule } from '../utils/utils.module.js';
import { GCounterModule } from './GCounter/GCounter.module.js';
import { MVRegisterModule } from './MVRegister/MVRegister.module.js';
import { PNCounterModule } from './PNCounter/PNCounter.module.js';
import { EWFlagModule } from './flag/EWFlag/EWFlag.module.js';
import { ORMapModule } from './map/ORMap/ORMap.module.js';
import { ReplicationGrpcModule } from './replicationGrpc/ReplicationGrpc.module.js';
import { SetModule } from './set/Set.module.js';
import { StatefulObjectController } from './stateful-object/stateful-object.controller.js';

@Module({
  imports: [
    ObjectsModule,
    MVRegisterModule,
    PNCounterModule,
    GCounterModule,
    EWFlagModule,
    SetModule,
    ORMapModule,
    UtilsModule,
    ReplicationGrpcModule,
    ReplicationModule.register(),
    GrpcTransportModule,
  ],
  controllers: [StatefulObjectController],
  providers: [],
  exports: [
    ObjectsModule,
    UtilsModule,
    ReplicationModule,
    GCounterModule,
    PNCounterModule,
    EWFlagModule,
    MVRegisterModule,
    SetModule,
    ORMapModule,
    GrpcTransportModule,
  ],
})
export class ControllersModule {}
