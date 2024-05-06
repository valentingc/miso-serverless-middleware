import { Module } from '@nestjs/common';
import { ObjectsModule } from '../../../../../../objects/objects.module.js';
import { GrpcTransportModule } from '../../../../../transports/grpc/grpc-transport.module.js';
import { GrpcFunctionDiscoveryServiceController } from './grpc-function-discovery.controller.js';
import { GrpcFunctionDiscoveryService } from './grpc-function-discovery.service.js';

@Module({
  imports: [GrpcTransportModule, ObjectsModule],
  controllers: [GrpcFunctionDiscoveryServiceController],
  providers: [GrpcFunctionDiscoveryService],
  exports: [GrpcFunctionDiscoveryService],
})
export class GrpcFunctionDiscoveryModule {}
