import { Metadata } from '@grpc/grpc-js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { UseInterceptors } from '@nestjs/common';
import { Ctx, GrpcService, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { LoggingInterceptor } from '../../interceptor/logging.interceptor.js';
import { StatefulObjectInterceptor } from '../../interceptor/stateful-object.interceptor.js';
import { StatefulObject } from '../../objects/stateful-object.js';
import { InjectStatefulObject } from '../../utils/get-stateful-object.decorator.js';
import { SetInterceptor } from './Set.interceptor.js';
import { SetService } from './Set.service.js';

@GrpcService('Set')
@miso.middleware.SetServiceControllerMethods()
@UseInterceptors(LoggingInterceptor, StatefulObjectInterceptor, SetInterceptor)
export class SetController implements miso.middleware.SetServiceController {
  constructor(private setService: SetService) {}
  getValue(
    @Payload()
    request: miso.middleware.SetOrRegisterGetValueRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.common.SetOrRegisterValueResponse
    | Promise<miso.common.SetOrRegisterValueResponse>
    | Observable<miso.common.SetOrRegisterValueResponse> {
    return this.setService.getValue(request, statefulObject);
  }
  removeOrSet(
    @Payload()
    request: miso.middleware.SetOrRegisterSetValueRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.common.SetOrRegisterValueResponse
    | Promise<miso.common.SetOrRegisterValueResponse>
    | Observable<miso.common.SetOrRegisterValueResponse> {
    return this.setService.removeOrSet(request, statefulObject);
  }

  add(
    @Payload()
    request: miso.middleware.SetOrRegisterSetValueRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.common.SetOrRegisterValueResponse
    | Observable<miso.common.SetOrRegisterValueResponse>
    | Promise<miso.common.SetOrRegisterValueResponse> {
    return this.setService.add(request, statefulObject);
  }
}
