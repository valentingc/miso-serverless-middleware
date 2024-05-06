import { Module } from '@nestjs/common';
import { K8sNodeDiscoveryService } from './k8s-node-discovery.service.js';

@Module({
  imports: [],
  providers: [K8sNodeDiscoveryService],
  exports: [K8sNodeDiscoveryService],
})
export class K8sNodeDiscoveryModule {}
