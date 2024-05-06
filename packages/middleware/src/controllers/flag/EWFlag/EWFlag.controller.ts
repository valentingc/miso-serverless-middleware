import { Metadata } from '@grpc/grpc-js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { UseInterceptors } from '@nestjs/common';
import { Ctx, GrpcService, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { LoggingInterceptor } from '../../../interceptor/logging.interceptor.js';
import { StatefulObjectInterceptor } from '../../../interceptor/stateful-object.interceptor.js';
import { StatefulObject } from '../../../objects/stateful-object.js';
import { InjectStatefulObject } from '../../../utils/get-stateful-object.decorator.js';
import { EWFlagInterceptor } from './EWFlag.interceptor.js';
import { EWFlagService } from './EWFlag.service.js';

@GrpcService('EWFlag')
@miso.middleware.EWFlagServiceControllerMethods()
@UseInterceptors(
  LoggingInterceptor,
  StatefulObjectInterceptor,
  EWFlagInterceptor,
)
export class EWFlagController
  implements miso.middleware.EWFlagServiceController
{
  constructor(private ewFlagService: EWFlagService) {}
  getValue(
    @Payload()
    request: miso.middleware.CounterGetValueRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.common.FlagSetValueReponse
    | Promise<miso.common.FlagSetValueReponse>
    | Observable<miso.common.FlagSetValueReponse> {
    if (
      request.statefulObjectBase?.crdtName === undefined ||
      request.statefulObjectBase?.statefulObjectId === undefined
    ) {
      throw new Error('Trying to assign undefined');
    }
    return this.ewFlagService.getValue(request, statefulObject);
  }

  assign(
    @Payload()
    request: miso.middleware.FlagSetValueRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.common.FlagSetValueReponse
    | Promise<miso.common.FlagSetValueReponse>
    | Observable<miso.common.FlagSetValueReponse> {
    if (request.value === undefined) {
      throw new Error('Trying to assign undefined');
    }

    return this.ewFlagService.assign(request, statefulObject);
  }
}
