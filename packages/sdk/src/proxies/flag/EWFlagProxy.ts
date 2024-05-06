import { CRDTSetType } from '@miso/common/dist/grpc/client/miso/common/CRDTSetType';
import { FlagSetValueReponse } from '@miso/common/dist/grpc/client/miso/common/FlagSetValueReponse';
import { CounterGetValueRequest } from '@miso/common/dist/grpc/client/miso/middleware/CounterGetValueRequest';
import { EWFlagServiceClient } from '@miso/common/dist/grpc/client/miso/middleware/EWFlagService';
import { FlagSetValueRequest } from '@miso/common/dist/grpc/client/miso/middleware/FlagSetValueRequest';
import { StatefulObjectProxy } from '../../StatefulObjectProxy';
import { ICrdtProxy } from '../ICrdtProxy.js';
import { makeGrpcCall } from '../shared/GrpcCall';
import { IEWFlagProxy } from './IEWFlagProxy';

export class EWFlagProxy implements IEWFlagProxy, ICrdtProxy {
  protected grpcService: EWFlagServiceClient | undefined;

  config: {
    crdtName: string;
    replicaId: string;
    statefulObjectId: string;
    crdtSetType: CRDTSetType;
    serverlessFunctionName: string;
  };

  constructor() {
    this.config = {} as any;
  }

  static create(
    crdtName: string,
    statefulObject: StatefulObjectProxy,
    grpcService: EWFlagServiceClient,
  ) {
    const instance = new EWFlagProxy();
    instance.grpcService = grpcService;

    instance.config = {
      crdtName: crdtName,
      replicaId: statefulObject.config.replicaId,
      statefulObjectId: statefulObject.id(),
      crdtSetType: CRDTSetType.EWFLAG,
      serverlessFunctionName: statefulObject.serverlessFunctionName(),
    };
    return instance;
  }

  get type() {
    return 'EWFlagProxy';
  }

  async assign(value: boolean): Promise<boolean> {
    if (this.grpcService === undefined) {
      throw new Error('Instance was not created via #create() factory method');
    }

    const payload: FlagSetValueRequest = {
      statefulObjectBase: {
        crdtName: this.config.crdtName,
        statefulObjectId: this.config.statefulObjectId,
      },
      replicaId: this.config.replicaId,
      functionBase: {
        serverlessFunctionName: this.config.serverlessFunctionName,
      },
      value: value,
    };
    const response = await makeGrpcCall<
      FlagSetValueRequest,
      FlagSetValueReponse
    >(
      (
        payload: FlagSetValueRequest,
        callback: (err: any, response: any) => void,
      ) => {
        this.grpcService?.assign(payload, callback);
      },
      payload,
    );
    if (response.value === undefined) {
      throw new Error('Undefined response');
    }
    return response.value;
  }
  async getValue(): Promise<boolean> {
    if (this.grpcService === undefined) {
      throw new Error('Instance was not created via #create() factory method');
    }
    const payload: CounterGetValueRequest = {
      functionBase: {
        serverlessFunctionName: this.config.serverlessFunctionName,
      },
      statefulObjectBase: {
        crdtName: this.config.crdtName,
        statefulObjectId: this.config.statefulObjectId,
      },
    };

    const response = await makeGrpcCall<
      CounterGetValueRequest,
      FlagSetValueReponse
    >(
      (
        payload: CounterGetValueRequest,
        callback: (err: any, response: any) => void,
      ) => {
        this.grpcService?.getValue(payload, callback);
      },
      payload,
    );

    if (response.value === undefined) {
      throw new Error('Undefined response');
    }
    return response.value;
  }
}
