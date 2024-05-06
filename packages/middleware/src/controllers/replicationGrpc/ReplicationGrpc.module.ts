import { Module, forwardRef } from '@nestjs/common';
import { ControllersModule } from '../controllers.module.js';
import { ReplicationGrpcController } from './ReplicationGrpc.controller.js';

@Module({
  imports: [forwardRef(() => ControllersModule)],
  controllers: [ReplicationGrpcController],
})
export class ReplicationGrpcModule {}
