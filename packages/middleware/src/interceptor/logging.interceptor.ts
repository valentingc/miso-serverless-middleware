import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { IncomingMessage } from 'http';
import { Counter, Histogram, register } from 'prom-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { inspect } from 'util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  private counterGrpcCore: Counter;
  constructor() {
    const existingGrpcCoreCounter = register.getSingleMetric(
      'miso_total_requests',
    );
    if (existingGrpcCoreCounter) {
      this.counterGrpcCore = existingGrpcCoreCounter as Counter;
    } else {
      this.counterGrpcCore = new Counter({
        name: 'miso_total_requests',
        help: 'Total number of requests',
      });
    }
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      const http = context.switchToHttp();
      const request: IncomingMessage = http.getRequest();
      this.logger.verbose(
        'Incoming HTTP Request: ' + request.method + ' to ' + request.url,
      );
      return next.handle();
    }
    this.logger.debug(
      `${context.getType()} Request (${context.getClass().name}#${
        context.getHandler().name
      }) start:${JSON.stringify(context.getArgByIndex(0))}`,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap((res) => {
        if (context.getClass().name === 'ReplicationGrpcController') {
          this.logger.log('IS FROM REPLICATION');
          let metric = register.getSingleMetric(
            'miso_average_replication_size',
          ) as Histogram;
          if (!metric) {
            metric = new Histogram({
              name: 'miso_average_replication_size',
              help: 'Average payload size of replication',
            });
          }
          const req = context.switchToRpc();
          const data = req.getData();
          const size = Buffer.byteLength(inspect(data), 'utf-8');
          this.logger.debug('Replication size: ' + size + ' bytes');
          metric.observe(size);
        } else {
          this.counterGrpcCore.inc();
        }
        this.logger.debug(
          `${context.getType()} Request (${context.getClass().name}#${
            context.getHandler().name
          }) finished... ${Date.now() - now}ms, Request: ${
            !(context.getArgByIndex(0) instanceof Observable)
              ? JSON.stringify(context.getArgByIndex(0))
              : 'OBSERVABLE'
          }, Response: ${JSON.stringify(res)}`,
        );
      }),
    );
  }
}
