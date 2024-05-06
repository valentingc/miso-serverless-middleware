import { Module } from '@nestjs/common';
import { K8sFunctionDiscoveryServiceController } from './k8s-function-discovery.controller.js';
import { K8sFunctionDiscoveryService } from './k8s-function-discovery.service.js';

@Module({
  imports: [],
  controllers: [K8sFunctionDiscoveryServiceController],
  providers: [K8sFunctionDiscoveryService],
  exports: [K8sFunctionDiscoveryService],
})
export class K8sFunctionDiscoveryModule {}
