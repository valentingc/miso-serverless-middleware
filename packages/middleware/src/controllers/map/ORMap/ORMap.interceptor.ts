import { CRDTSetType } from '@miso/common/dist/grpc/server/common.js';
import { Inject, Injectable, Logger, Type } from '@nestjs/common';
import { BaseCrdtInitializerInterceptor } from '../../../interceptor/base-crdt-initializer.interceptor.js';
import { ObjectsService } from '../../../objects/objects.service.js';
import { StatefulObject } from '../../../objects/stateful-object.js';
import { FunctionDiscoveryStrategy } from '../../../overlay-network/discovery/serverless-function-discovery/function-discovery-strategy.interface.js';
import { GrpcClientService } from '../../../overlay-network/transports/grpc/grpc-client.service.js';
import { ORMapService } from './ORMap.service.js';

@Injectable()
export class ORMapInterceptor extends BaseCrdtInitializerInterceptor {
  protected logger: Logger = new Logger(ORMapInterceptor.name);
  constructor(
    protected readonly objectService: ObjectsService,
    @Inject('OverlayFunctionDiscoveryService')
    protected readonly functionDiscoveryService: FunctionDiscoveryStrategy,
    protected readonly grpcClientService: GrpcClientService,
    protected readonly orMapService: ORMapService,
  ) {
    super(objectService, functionDiscoveryService, grpcClientService);
  }
  getPayloadAndGrpcMethod(
    clazz: Type<any>,
    crdtName: string,
    statefulObject: StatefulObject,
    request: any,
  ) {
    throw new Error('Not implemented');
    return {} as any;
  }

  setRetrievedCrdtData(
    data: any,
    clazz: Type<any>,
    statefulObject: StatefulObject,
    crdSetType?: CRDTSetType,
  ) {
    this.logger.debug(
      "Setting retrieved ORMap data for crdt: '" + clazz.name + "'",
    );

    throw new Error('Not implemented');
  }
}
