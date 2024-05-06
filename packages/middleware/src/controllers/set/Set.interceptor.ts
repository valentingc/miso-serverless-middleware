import {
  CRDTSetType,
  SetGenericType,
  SetInitRequest,
} from '@miso/common/dist/grpc/server/common.js';
import { Inject, Injectable, Logger, Type } from '@nestjs/common';
import { BaseCrdtInitializerInterceptor } from '../../interceptor/base-crdt-initializer.interceptor.js';
import { ObjectsService } from '../../objects/objects.service.js';
import { StatefulObject } from '../../objects/stateful-object.js';
import { FunctionDiscoveryStrategy } from '../../overlay-network/discovery/serverless-function-discovery/function-discovery-strategy.interface.js';
import {
  AllowedGrpcReplicationMethods,
  GrpcClientService,
} from '../../overlay-network/transports/grpc/grpc-client.service.js';
import { SetService } from './Set.service.js';

@Injectable()
export class SetInterceptor extends BaseCrdtInitializerInterceptor {
  protected logger: Logger = new Logger(SetInterceptor.name);
  constructor(
    protected readonly objectService: ObjectsService,
    @Inject('OverlayFunctionDiscoveryService')
    protected readonly functionDiscoveryService: FunctionDiscoveryStrategy,
    protected readonly grpcClientService: GrpcClientService,
    private readonly setService: SetService,
  ) {
    super(objectService, functionDiscoveryService, grpcClientService);
  }
  getPayloadAndGrpcMethod(
    clazz: Type<any>,
    crdtName: string,
    statefulObject: StatefulObject,
    request: any,
  ) {
    this.logger.debug(
      "_getPayloadAndGrpcMethod, clazz: '" +
        clazz.name +
        "'" +
        " crdtName: '" +
        crdtName +
        "'",
    );
    let payload: SetInitRequest;
    let method: AllowedGrpcReplicationMethods;

    switch (request.crdtType) {
      case CRDTSetType.ORSET:
        const setGenericType: SetGenericType =
          request.setValueType ?? request.type ?? SetGenericType.UNRECOGNIZED;

        const pl: SetInitRequest = {
          crdtSetType: request.crdtType,
          setGenerictype: setGenericType,
          statefulObjectBase: {
            crdtName: crdtName,
            statefulObjectId: statefulObject.id,
          },
          functionBase: {
            serverlessFunctionName: statefulObject.serverlessFunctionName,
          },
        };
        payload = pl;
        method = 'retrieveOrSet';
        break;
      case CRDTSetType.GSET:
        const setGenericTypeGSet: SetGenericType =
          request.setValueType ?? request.type ?? SetGenericType.UNRECOGNIZED;

        const plGset: SetInitRequest = {
          crdtSetType: request.crdtType,
          setGenerictype: setGenericTypeGSet,
          statefulObjectBase: {
            crdtName: crdtName,
            statefulObjectId: statefulObject.id,
          },
          functionBase: {
            serverlessFunctionName: statefulObject.serverlessFunctionName,
          },
        };
        payload = plGset;
        method = 'retrieveGSet';
        break;
      default:
        throw new Error('CRDT type not supported');
    }

    return {
      grpcMethod: method,
      payload,
    };
  }

  setRetrievedCrdtData(
    data: any,
    clazz: Type<any>,
    statefulObject: StatefulObject,
    crdSetType?: CRDTSetType,
  ) {
    switch (crdSetType) {
      case CRDTSetType.ORSET:
        this.logger.debug(
          "Setting retrieved ORSet data for crdt: '" + clazz.name + "'",
        );

        this.setService.mergeOrSet(data.value, statefulObject);
        break;
      case CRDTSetType.GSET:
        this.logger.debug(
          "Setting retrieved GSet data for crdt: '" + clazz.name + "'",
        );

        this.setService.mergeGSet(data.value, statefulObject);
        break;
    }
  }
}
