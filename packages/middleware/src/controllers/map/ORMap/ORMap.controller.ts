import { Metadata } from '@grpc/grpc-js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { Logger, UseInterceptors } from '@nestjs/common';
import { Ctx, GrpcService, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { LoggingInterceptor } from '../../../interceptor/logging.interceptor.js';
import { StatefulObjectInterceptor } from '../../../interceptor/stateful-object.interceptor.js';
import { StatefulObject } from '../../../objects/stateful-object.js';
import { InjectStatefulObject } from '../../../utils/get-stateful-object.decorator.js';
import { jsonMapReplacer } from '../../../utils/json.utils.js';
import { ORMapService } from './ORMap.service.js';

@GrpcService('ORMap')
@miso.middleware.ORMapServiceControllerMethods()
@UseInterceptors(LoggingInterceptor, StatefulObjectInterceptor)
export class ORMapController implements miso.middleware.ORMapServiceController {
  private logger: Logger = new Logger(ORMapController.name);

  constructor(private orMapService: ORMapService) {}

  set(
    @Payload()
    request: miso.middleware.MapSetValueRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.middleware.MapValueResponse
    | Promise<miso.middleware.MapValueResponse>
    | Observable<miso.middleware.MapValueResponse> {
    this.logger.debug(
      'ORMap SET request: ' + JSON.stringify(request, jsonMapReplacer),
    );
    return this.orMapService.set(request, statefulObject);
  }
  remove(
    @Payload()
    request: miso.middleware.MapDeleteValueRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.common.AckResponse
    | Promise<miso.common.AckResponse>
    | Observable<miso.common.AckResponse> {
    this.logger.debug(
      'ORMap REMOVE request: ' + JSON.stringify(request, jsonMapReplacer),
    );
    return this.orMapService.remove(request, statefulObject);
  }
  get(
    @Payload()
    request: miso.middleware.MapGetValueRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.middleware.MapValueResponse
    | Promise<miso.middleware.MapValueResponse>
    | Observable<miso.middleware.MapValueResponse> {
    this.logger.debug(
      'ORMap GET request: ' + JSON.stringify(request, jsonMapReplacer),
    );
    return this.orMapService.get(request, statefulObject);
  }
  has(
    @Payload()
    request: miso.middleware.MapGetValueRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.common.BoolResponse
    | Promise<miso.common.BoolResponse>
    | Observable<miso.common.BoolResponse> {
    this.logger.debug(
      'ORMap HAS request: ' + JSON.stringify(request, jsonMapReplacer),
    );
    return this.orMapService.has(request, statefulObject);
  }
  keys(
    @Payload()
    request: miso.middleware.MapGetKeysRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.middleware.MapGetKeysResponse
    | Promise<miso.middleware.MapGetKeysResponse>
    | Observable<miso.middleware.MapGetKeysResponse> {
    return this.orMapService.keys(request, statefulObject);
  }
  clear(
    @Payload()
    request: miso.middleware.MapClearValueRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
    ...rest: any
  ):
    | miso.common.AckResponse
    | Promise<miso.common.AckResponse>
    | Observable<miso.common.AckResponse> {
    this.logger.debug(
      'ORMap CLEAR request: ' + JSON.stringify(request, jsonMapReplacer),
    );
    return this.orMapService.clear(request, statefulObject);
  }
}
