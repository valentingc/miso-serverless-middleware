import { Module } from '@nestjs/common';
import { GrpcTransportModule } from '../../../../../transports/grpc/grpc-transport.module.js';
import { MdnsOverlayNodeDiscoveryServiceController } from './mdns-discovery.controller.js';
import { MdnsDiscoveryService } from './mdns-discovery.service.js';

@Module({
  controllers: [MdnsOverlayNodeDiscoveryServiceController],
  imports: [GrpcTransportModule],
  providers: [MdnsDiscoveryService],
  exports: [MdnsDiscoveryService],
})
export class MdnsDiscoveryModule {}
