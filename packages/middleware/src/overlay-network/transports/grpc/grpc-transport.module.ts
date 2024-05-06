import { Module } from '@nestjs/common';
import { GrpcClientService } from './grpc-client.service.js';

@Module({
  imports: [],
  providers: [GrpcClientService],
  exports: [GrpcClientService],
})
export class GrpcTransportModule {}
