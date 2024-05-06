import { Metadata } from '@grpc/grpc-js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { Logger, UseInterceptors } from '@nestjs/common';
import { Ctx, GrpcService, Payload } from '@nestjs/microservices';
import { LoggingInterceptor } from '../../interceptor/logging.interceptor.js';
import { StatefulObjectInterceptor } from '../../interceptor/stateful-object.interceptor.js';
import { StatefulObject } from '../../objects/stateful-object.js';
import { InjectStatefulObject } from '../../utils/get-stateful-object.decorator.js';
@GrpcService('StatefulObjectService')
@miso.middleware.StatefulObjectServiceControllerMethods()
@UseInterceptors(LoggingInterceptor, StatefulObjectInterceptor)
export class StatefulObjectController {
  private logger: Logger = new Logger(StatefulObjectController.name);

  remove(
    @Payload()
    request: miso.middleware.DeleteCrdtRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ): miso.common.BoolResponse {
    if (!request.statefulObjectBase?.crdtName) {
      throw new Error('CRDT name is required');
    }
    this.logger.log(
      `Removing CRDT with name: ${request.statefulObjectBase?.crdtName}`,
    );
    const result = statefulObject.removeCrdt(
      request.statefulObjectBase?.crdtName,
    );
    return {
      response: result,
    };
  }
}
