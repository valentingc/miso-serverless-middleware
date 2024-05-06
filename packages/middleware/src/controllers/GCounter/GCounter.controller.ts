import { Metadata } from '@grpc/grpc-js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { Logger, UseInterceptors } from '@nestjs/common';
import { Ctx, GrpcService, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { LoggingInterceptor } from '../../interceptor/logging.interceptor.js';
import { StatefulObjectInterceptor } from '../../interceptor/stateful-object.interceptor.js';
import { StatefulObject } from '../../objects/stateful-object.js';
import { InjectStatefulObject } from '../../utils/get-stateful-object.decorator.js';
import { GCounterInterceptor } from './GCounter.interceptor.js';
import { GCounterService } from './GCounter.service.js';
@GrpcService('GCounter')
@miso.middleware.GCounterServiceControllerMethods()
@UseInterceptors(
  LoggingInterceptor,
  StatefulObjectInterceptor,
  GCounterInterceptor,
)
export class GCounterController
  implements miso.middleware.GCounterServiceController
{
  private readonly logger = new Logger(GCounterController.name);

  constructor(private readonly gCounterService: GCounterService) {}

  add(
    @Payload()
    request: miso.middleware.CounterAddOrSubtractValueRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.common.CounterResponse
    | Observable<miso.common.CounterResponse>
    | Promise<miso.common.CounterResponse> {
    return this.gCounterService.add(request, statefulObject);
  }

  getValue(
    @Payload()
    request: miso.middleware.CounterGetValueRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.common.CounterResponse
    | Observable<miso.common.CounterResponse>
    | Promise<miso.common.CounterResponse> {
    return this.gCounterService.getValue(request, statefulObject);
  }
}
