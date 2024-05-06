// replication-metrics.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge, Histogram, Summary } from 'prom-client';
import {
  MiddlewareConfig,
  OverlayOptions,
} from '../config/middleware-config.js';

interface NodeAverageTime {
  currentAverage: number;
  count: number;
}
@Injectable()
export class ReplicationMetricsService {
  private thisNodeName: string;
  constructor(
    readonly configService: ConfigService<MiddlewareConfig>,
    @InjectMetric('miso_replication_time')
    private readonly replicationTime: Histogram,
    @InjectMetric('miso_replication_time_all')
    private readonly replicationTimeAll: Histogram,
    @InjectMetric('miso_replication_time_all_gauge')
    private readonly replicationTimeGauge: Gauge,
    @InjectMetric('miso_replication_time_summary')
    private readonly replicationTimeSummary: Summary,
    @InjectMetric('miso_replication_time_complete')
    private readonly replicationTimeComplete: Histogram,
    @InjectMetric('miso_total_requests_replication')
    private readonly replicationRequestsCounter: Counter,
    @InjectMetric('miso_replication_time_processing')
    private readonly replicationTimeProcessing: Histogram,
  ) {
    replicationTime.labels('Node');
    this.thisNodeName =
      this.configService.get<OverlayOptions>('overlay')?.discovery.node
        .thisNodeName ?? 'unknown';
  }
  private logger: Logger = new Logger(ReplicationMetricsService.name);

  private nodeAverageTimes: Map<string, NodeAverageTime> = new Map();

  increaseReplicationRequestsCounter(): void {
    this.replicationRequestsCounter.inc();
  }

  recordTotalReplicationTime(time: number): void {
    this.logger.debug('Recorded total replication time: ' + time);
    this.replicationTimeComplete.observe(time);
  }

  recordReplicationProcessingTime(time: number): void {
    this.logger.debug('Recorded replication processing time: ' + time);
    this.replicationTimeProcessing.observe(time);
  }

  recordSingleReplicationTime(nodeName: string, time: number): void {
    this.logger.debug(
      'Recorded single replication time: ' + time + ' for node ' + nodeName,
    );
    this.replicationTime.observe({ Node: nodeName }, time);
    this.replicationTimeAll.observe(time);

    this.replicationTimeSummary.observe(
      {
        sourceNode: this.thisNodeName,
        targetNode: nodeName,
      },
      time,
    );
    this.logger.debug('Replication time for node ' + nodeName + ': ' + time);
    const currentAverage = this.nodeAverageTimes.get(nodeName) || {
      currentAverage: 0,
      count: 0,
    };
    currentAverage.count = currentAverage.count + 1;
    currentAverage.currentAverage +=
      (time - currentAverage.currentAverage) / currentAverage.count;
    this.nodeAverageTimes.set(nodeName, currentAverage);
    this.replicationTimeGauge.set(currentAverage.currentAverage);
  }

  getNodeAverage(nodeName: string): number {
    return this.nodeAverageTimes.get(nodeName)?.currentAverage || 0;
  }

  calculateAverageReplicationTime(): number {
    let totalAverage = 0;
    let totalCount = 0;

    for (const averageTime of this.nodeAverageTimes.values()) {
      totalAverage += averageTime.currentAverage * averageTime.count;
      totalCount += averageTime.count;
    }

    return totalCount > 0 ? totalAverage / totalCount : 0;
  }
}
