import { GrpcService } from '@nestjs/microservices';
import { ReplicationMetricsService } from './replication-metrics.service.js';

@GrpcService('metrics/replication')
export class ReplicationMetricsController {
  constructor(private readonly metricsService: ReplicationMetricsService) {}

  public getAverageReplicationTime() {
    return {
      averageReplicationTime:
        this.metricsService.calculateAverageReplicationTime(),
    };
  }
}
