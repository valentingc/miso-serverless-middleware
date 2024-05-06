import { DynamicModule, Module } from '@nestjs/common';
import {
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
  makeSummaryProvider,
} from '@willsoto/nestjs-prometheus';
import { NodeDiscoveryModule } from '../overlay-network/discovery/node-discovery/node-discovery.module.js';
import { FunctionDiscoveryModule } from '../overlay-network/discovery/serverless-function-discovery/function-discovery.module.js';
import { GrpcTransportModule } from '../overlay-network/transports/grpc/grpc-transport.module.js';
import { ReplicationMetricsController } from './replication-metrics.controller.js';
import { ReplicationMetricsService } from './replication-metrics.service.js';
import { ReplicationService } from './replication.service.js';

@Module({})
export class ReplicationModule {
  static register(): DynamicModule {
    const imports = [
      NodeDiscoveryModule.forRoot(),
      FunctionDiscoveryModule.forRoot(),
      GrpcTransportModule,
    ];
    const providers: any[] = [
      ReplicationService,
      ReplicationMetricsService,
      makeHistogramProvider({
        name: 'miso_replication_time',
        help: 'Histogram for replication times',
        labelNames: ['Node'],
      }),
      makeHistogramProvider({
        name: 'miso_replication_time_all',
        help: 'Histogram for all replication times',
      }),
      makeHistogramProvider({
        name: 'miso_replication_time_complete',
        help: 'Histogram for all complete replication times (until all nodes reached)',
      }),
      makeGaugeProvider({
        name: 'miso_replication_time_all_gauge',
        help: 'Gauge for all replication times',
      }),
      makeSummaryProvider({
        name: 'miso_replication_time_summary',
        help: 'Summary for all replication times',
        labelNames: ['sourceNode', 'targetNode'],
      }),
      makeCounterProvider({
        name: 'miso_total_requests_replication',
        help: 'Total number of incoming requests regarding the replication',
      }),
      makeHistogramProvider({
        name: 'miso_replication_time_processing',
        help: 'Histogram for replication processing times',
      }),
    ];
    const exports: any[] = [
      ReplicationService,
      NodeDiscoveryModule,
      FunctionDiscoveryModule,
      ReplicationMetricsService,
    ];

    return {
      module: ReplicationModule,
      imports,
      providers,
      exports,
      controllers: [ReplicationMetricsController],
    };
  }
}
