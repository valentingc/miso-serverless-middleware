import { Metadata } from '@grpc/grpc-js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { UseInterceptors } from '@nestjs/common';
import { Ctx, GrpcService, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { LoggingInterceptor } from '../../interceptor/logging.interceptor.js';
import { StatefulObjectInterceptor } from '../../interceptor/stateful-object.interceptor.js';
import { StatefulObject } from '../../objects/stateful-object.js';
import { InjectStatefulObject } from '../../utils/get-stateful-object.decorator.js';
import { PNCounterInterceptor } from './PNCounter.interceptor.js';
import { PNCounterService } from './PNCounter.service.js';
@GrpcService('PNCounter')
@miso.middleware.PNCounterServiceControllerMethods()
@UseInterceptors(
  LoggingInterceptor,
  StatefulObjectInterceptor,
  PNCounterInterceptor,
)
export class PNCounterController
  implements miso.middleware.PNCounterServiceController
{
  constructor(private readonly pnCounterService: PNCounterService) {}

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
    return this.pnCounterService.add(request, statefulObject);
  }
  subtract(
    @Payload()
    request: miso.middleware.CounterAddOrSubtractValueRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.common.CounterResponse
    | Observable<miso.common.CounterResponse>
    | Promise<miso.common.CounterResponse> {
    return this.pnCounterService.subtract(request, statefulObject);
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
    return this.pnCounterService.getValue(request, statefulObject);
  }
}
