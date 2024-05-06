import { Metadata } from '@grpc/grpc-js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { Logger, UseInterceptors } from '@nestjs/common';
import { Ctx, GrpcService, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { LoggingInterceptor } from '../../interceptor/logging.interceptor.js';
import { StatefulObjectInterceptor } from '../../interceptor/stateful-object.interceptor.js';
import { StatefulObject } from '../../objects/stateful-object.js';
import { InjectStatefulObject } from '../../utils/get-stateful-object.decorator.js';
import { MVRegisterInterceptor } from './MVRegister.interceptor.js';
import { MVRegisterService } from './MVRegister.service.js';

@GrpcService('MVRegister')
@miso.middleware.MVRegisterServiceControllerMethods()
@UseInterceptors(
  LoggingInterceptor,
  StatefulObjectInterceptor,
  MVRegisterInterceptor,
)
export class MVRegisterController
  implements miso.middleware.MVRegisterServiceController
{
  private readonly logger = new Logger(MVRegisterController.name);

  constructor(private mvRegisterService: MVRegisterService) {}
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
    return this.mvRegisterService.getValue(request, statefulObject);
  }

  assign(
    @Payload()
    request: miso.middleware.SetOrRegisterSetValueRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.common.SetOrRegisterValueResponse
    | Observable<miso.common.SetOrRegisterValueResponse>
    | Promise<miso.common.SetOrRegisterValueResponse> {
    return this.mvRegisterService.assign(request, statefulObject);
  }
}
