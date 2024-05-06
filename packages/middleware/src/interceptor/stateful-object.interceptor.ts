import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ObjectsService } from '../objects/objects.service.js';
import { FunctionDiscoveryStrategy } from '../overlay-network/discovery/serverless-function-discovery/function-discovery-strategy.interface.js';

@Injectable()
export class StatefulObjectInterceptor implements NestInterceptor {
  private logger: Logger = new Logger(StatefulObjectInterceptor.name);
  constructor(
    private readonly objectService: ObjectsService,
    @Inject('OverlayFunctionDiscoveryService')
    private readonly functionDiscoveryService: FunctionDiscoveryStrategy,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToRpc().getData();
    if (context.getArgByIndex(0) instanceof Observable === false) {
      const statefulObjectId = request.statefulObjectBase?.statefulObjectId;
      const serverlessFunctionName =
        request.functionBase?.serverlessFunctionName;
      if (!statefulObjectId || !serverlessFunctionName) {
        this.logger.verbose('No stateful object ID or serverless fn name');
        return next.handle();
      }

      this.logger.verbose(
        `Trying to inject Stateful Object into request: ${JSON.stringify(
          request,
        )}`,
      );

      const hasStatefulObject = this.objectService.hasStatefulObject(
        serverlessFunctionName,
        statefulObjectId,
      );
      let statefulObject;
      if (hasStatefulObject === true) {
        statefulObject = this.objectService.getStatefulObject(
          statefulObjectId,
          serverlessFunctionName,
        );
      } else {
        statefulObject = this.objectService.createStatefulObject(
          statefulObjectId,
          serverlessFunctionName,
        );
      }
      request.statefulObject = statefulObject;
    }

    return next.handle();
  }
}
