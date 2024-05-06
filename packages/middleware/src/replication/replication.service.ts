import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subject, auditTime, firstValueFrom } from 'rxjs';
import {
  MiddlewareConfig,
  MiddlewareOptions,
  OverlayOptions,
} from '../config/middleware-config.js';
import { NodeDiscoveryStrategy } from '../overlay-network/discovery/node-discovery/node-discovery-strategy.interface.js';
import { FunctionDiscoveryStrategy } from '../overlay-network/discovery/serverless-function-discovery/function-discovery-strategy.interface.js';
import {
  GrpcClientPackageType,
  GrpcClientService,
} from '../overlay-network/transports/grpc/grpc-client.service.js';
import { ReplicationTask } from './events/replication-task.js';
import { MiddlewareInstance } from './interfaces/middleware-instance.interface.js';
import { ReplicationMetricsService } from './replication-metrics.service.js';

@Injectable()
export class ReplicationService implements OnModuleDestroy {
  private logger: Logger = new Logger(ReplicationService.name);
  private thisNodeName: string;
  private crdtSubjects = new Map<string, Subject<ReplicationTask>>();
  private REPLICATION_DELAY_MS: number;

  constructor(
    @Inject('OverlayNodeDiscoveryService')
    private readonly nodeDiscoveryService: NodeDiscoveryStrategy,
    @Inject('OverlayFunctionDiscoveryService')
    private readonly functionDiscoveryService: FunctionDiscoveryStrategy,
    private readonly grpcClientService: GrpcClientService,
    private readonly configService: ConfigService<MiddlewareConfig>,
    private readonly metricsService: ReplicationMetricsService,
  ) {
    this.logger.debug('ReplicationService instantiated');
    this.nodeDiscoveryService.startDiscovery();
    this.functionDiscoveryService.startDiscovery(this.nodeDiscoveryService);

    const middlewareOptions =
      configService.get<MiddlewareOptions>('middlewareOptions');
    if (
      middlewareOptions === undefined ||
      middlewareOptions.replicationDelayMs === undefined
    ) {
      throw new Error('ReplicationDelayMs not defined in config');
    }
    this.REPLICATION_DELAY_MS = middlewareOptions?.replicationDelayMs;

    const discoveryOptions =
      configService.get<OverlayOptions>('overlay')?.discovery;
    if (discoveryOptions === undefined) {
      throw new Error('discoveryOptions is undefined');
    }
    this.thisNodeName = discoveryOptions.node.thisNodeName;
  }
  onModuleDestroy() {
    this.logger.debug('Cleaning up ReplicationService');
    this.nodeDiscoveryService.eventEmitter.removeAllListeners();
  }

  async queueReplicationTask(task: ReplicationTask) {
    const { statefulObjectId, crdtName } = task;
    const key = `${statefulObjectId}-${crdtName}`;

    if (!this.crdtSubjects.has(key)) {
      const subject = new Subject<ReplicationTask>();
      this.crdtSubjects.set(key, subject);
      this.logger.warn('Replication triggered');
      subject
        .pipe(auditTime(this.REPLICATION_DELAY_MS))
        .subscribe((latestTask) => {
          this.logger.debug('Replication debounced');
          return this._replicate(latestTask);
        });
    }
    const subject = this.crdtSubjects.get(key);

    if (subject === undefined) {
      throw new Error('Subject for CRDT replication task is undefined');
    }

    subject.next(task);
  }

  private async _replicate(task: ReplicationTask) {
    const replicateToNew: Set<MiddlewareInstance> =
      await this.functionDiscoveryService.getReplicationTargets(
        task.serverlessFunctionName,
      );

    this.logger.log(
      new Date().toISOString() +
        ' - ' +
        'Replicate to: ' +
        replicateToNew.size +
        ' middleware instances, task: ' +
        JSON.stringify(task),
    );

    const replicationStart = process.hrtime.bigint();

    try {
      await Promise.all(
        Array.from(replicateToNew).map(async (entry) => {
          return new Promise<void>(async (resolve, reject) => {
            if (entry.hostName === this.thisNodeName) {
              this.logger.verbose('Skipping replication to self');
              return;
            }
            this.logger.debug(
              'Replicating to hostName: ' +
                entry.hostName +
                ', ip: ' +
                entry.hostIpAddress +
                ', port: 5001',
            );
            const ipAddress = entry.hostIpAddress;

            try {
              const res = await firstValueFrom(
                this.grpcClientService.callStreamingGrpcMethod(
                  ipAddress,
                  task.grpcMethod,
                  GrpcClientPackageType.PACKAGE_MISO_REPLICATION,
                  task.payload,
                ).sendSubject,
              );
              this.logger.log('Replication response: ' + JSON.stringify(res));
              const end = process.hrtime.bigint();
              this.metricsService.increaseReplicationRequestsCounter();

              this.logger.log(
                `Replication to node ${entry.hostName} done, time: ` +
                  Number(end - replicationStart) / 1e6,
              );
              this.metricsService.recordSingleReplicationTime(
                entry.hostName,
                Number(end - replicationStart) / 1e6,
              );
              resolve();
            } catch (error) {
              this.logger.error(
                'Replication Network error, ipAddress: ' +
                  ipAddress +
                  ' - ' +
                  error,
              );
              reject(error);
            }

            // resolve(res);
          });
        }),
      );
    } catch (error) {
      this.logger.error('Replication Network error' + error);
    }
    const replicationEnd = process.hrtime.bigint();
    const totalReplicationTime =
      Number(replicationEnd - replicationStart) / 1e6;
    await this.metricsService.recordTotalReplicationTime(totalReplicationTime);
  }
}
