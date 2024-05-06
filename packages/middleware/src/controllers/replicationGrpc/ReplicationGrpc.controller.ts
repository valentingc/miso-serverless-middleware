import { Metadata } from '@grpc/grpc-js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { Logger, UseInterceptors } from '@nestjs/common';
import {
  Ctx,
  GrpcService,
  GrpcStreamMethod,
  Payload,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { LoggingInterceptor } from '../../interceptor/logging.interceptor.js';
import { StatefulObjectInterceptor } from '../../interceptor/stateful-object.interceptor.js';
import { ObjectsService } from '../../objects/objects.service.js';
import { StatefulObject } from '../../objects/stateful-object.js';
import { ReplicationService } from '../../replication/replication.service.js';
import { createGrpcStreamingHandlerWithStatefulObject } from '../../utils/create-streaming-handler.js';
import { InjectStatefulObject } from '../../utils/get-stateful-object.decorator.js';
import { GCounterService } from '../GCounter/GCounter.service.js';
import { MVRegisterService } from '../MVRegister/MVRegister.service.js';
import { PNCounterService } from '../PNCounter/PNCounter.service.js';
import { EWFlagService } from '../flag/EWFlag/EWFlag.service.js';
import { SetService } from '../set/Set.service.js';
@UseInterceptors(LoggingInterceptor, StatefulObjectInterceptor)
@GrpcService('Replication')
@miso.replication.ReplicationServiceControllerMethods()
export class ReplicationGrpcController
  implements miso.replication.ReplicationServiceController
{
  private readonly logger = new Logger(ReplicationGrpcController.name);

  constructor(
    private objectService: ObjectsService,
    private gCounterService: GCounterService,
    private pnCounterService: PNCounterService,
    private ewFlagService: EWFlagService,
    private mvRegisterService: MVRegisterService,
    private setService: SetService,
    private replicationService: ReplicationService,
  ) {}
  retrieveEwFlag(
    @Payload()
    request: miso.common.CounterInitRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.replication.RetrieveEWFlagResponse
    | Observable<miso.replication.RetrieveEWFlagResponse>
    | Promise<miso.replication.RetrieveEWFlagResponse> {
    return this.ewFlagService.retrieveEWFlag(request, statefulObject);
  }
  retrieveMvRegister(
    @Payload()
    request: miso.common.SetInitRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.replication.RetrieveMVRegisterResponse
    | Observable<miso.replication.RetrieveMVRegisterResponse>
    | Promise<miso.replication.RetrieveMVRegisterResponse> {
    return this.mvRegisterService.retrieveMVRegister(request, statefulObject);
  }
  retrieveGSet(
    @Payload()
    request: miso.common.SetInitRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.replication.RetrieveGSetResponse
    | Observable<miso.replication.RetrieveGSetResponse>
    | Promise<miso.replication.RetrieveGSetResponse> {
    return this.setService.retrieveGSet(request, statefulObject);
  }
  retrieveOrSet(
    @Payload()
    request: miso.common.SetInitRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.replication.RetrieveORSetResponse
    | Observable<miso.replication.RetrieveORSetResponse>
    | Promise<miso.replication.RetrieveORSetResponse> {
    return this.setService.retrieveORSet(request, statefulObject);
  }

  retrievePnCounter(
    @Payload()
    request: miso.common.CounterInitRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.replication.RetrievePNCounterResponse
    | Observable<miso.replication.RetrievePNCounterResponse>
    | Promise<miso.replication.RetrievePNCounterResponse> {
    const crdtName = request.statefulObjectBase?.crdtName;
    if (crdtName === undefined) {
      throw new Error('CRDT name is undefined');
    }
    return this.pnCounterService.retrievePNCounter(crdtName, statefulObject);
  }

  retrieveGCounter(
    @Payload()
    request: miso.common.CounterInitRequest,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ):
    | miso.replication.RetrieveGCounterResponse
    | Observable<miso.replication.RetrieveGCounterResponse>
    | Promise<miso.replication.RetrieveGCounterResponse> {
    const crdtName = request.statefulObjectBase?.crdtName;
    if (crdtName === undefined) {
      throw new Error('CRDT name is undefined');
    }

    return this.gCounterService.retrieveGCounter(crdtName, statefulObject);
  }

  mergeOrSet(
    @Payload()
    request: Observable<miso.replication.ORSetUpdate>,
    @Ctx()
    metadata: Metadata,

    @InjectStatefulObject() statefulObject: StatefulObject,
  ): Observable<miso.common.SetOrRegisterValueResponse> {
    return createGrpcStreamingHandlerWithStatefulObject<
      miso.replication.ORSetUpdate,
      miso.common.SetOrRegisterValueResponse
    >(
      this.setService.mergeOrSet,
      this.objectService,
    )(request);
  }

  mergeGSet(
    @Payload()
    request: Observable<miso.replication.MVRegisterUpdate>,
    @Ctx()
    metadata: Metadata,

    @InjectStatefulObject() statefulObject: StatefulObject,
  ): Observable<miso.common.SetOrRegisterValueResponse> {
    return createGrpcStreamingHandlerWithStatefulObject<
      miso.replication.MVRegisterUpdate,
      miso.common.SetOrRegisterValueResponse
    >(
      this.setService.mergeGSet,
      this.objectService,
    )(request);
  }

  @GrpcStreamMethod()
  mergeMvRegister(
    @Payload()
    request: Observable<miso.replication.MVRegisterUpdate>,
    @Ctx()
    metadata: Metadata,

    @InjectStatefulObject() statefulObject: StatefulObject,
  ): Observable<miso.common.SetOrRegisterValueResponse> {
    return createGrpcStreamingHandlerWithStatefulObject<
      miso.replication.MVRegisterUpdate,
      miso.common.SetOrRegisterValueResponse
    >(
      this.mvRegisterService.merge,
      this.objectService,
    )(request);
  }

  @GrpcStreamMethod()
  mergeEwFlag(
    @Payload()
    request: Observable<miso.replication.EWFlagUpdate>,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ): Observable<miso.common.FlagSetValueReponse> {
    return createGrpcStreamingHandlerWithStatefulObject<
      miso.replication.EWFlagUpdate,
      miso.common.FlagSetValueReponse
    >(
      this.ewFlagService.merge,
      this.objectService,
    )(request);
  }

  @GrpcStreamMethod()
  mergePnCounter(
    @Payload()
    request: Observable<miso.replication.PNCounterUpdate>,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ): Observable<miso.common.CounterResponse> {
    this.logger.verbose('Opening GRPC stream for: mergePnCounter');
    return createGrpcStreamingHandlerWithStatefulObject<
      miso.replication.PNCounterUpdate,
      miso.common.CounterResponse
    >(
      this.pnCounterService.merge,
      this.objectService,
    )(request);
  }

  @GrpcStreamMethod()
  mergeGCounter(
    @Payload()
    request: Observable<miso.replication.GCounterUpdate>,
    @Ctx()
    metadata: Metadata,
    @InjectStatefulObject() statefulObject: StatefulObject,
  ): Observable<miso.common.CounterResponse> {
    this.logger.verbose('Opening GRPC stream for: bidiMergeCounter');
    return createGrpcStreamingHandlerWithStatefulObject<
      miso.replication.GCounterUpdate,
      miso.common.CounterResponse
    >(
      this.gCounterService.merge,
      this.objectService,
    )(request);
  }
}
