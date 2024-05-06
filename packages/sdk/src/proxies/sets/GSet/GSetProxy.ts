import { CRDTSetType } from '@miso/common/dist/grpc/client/miso/common/CRDTSetType';
import { SetGenericType } from '@miso/common/dist/grpc/client/miso/common/SetGenericType';
import { SetOrRegisterValueResponse } from '@miso/common/dist/grpc/client/miso/common/SetOrRegisterValueResponse';
import { SetOrRegisterGetValueRequest } from '@miso/common/dist/grpc/client/miso/middleware/SetOrRegisterGetValueRequest';
import { SetOrRegisterSetValueRequest } from '@miso/common/dist/grpc/client/miso/middleware/SetOrRegisterSetValueRequest';
import { SetServiceClient } from '@miso/common/dist/grpc/client/miso/middleware/SetService';
import { StatefulObjectProxy } from '../../../StatefulObjectProxy';
import { ICrdtProxy } from '../../ICrdtProxy.js';
import {
  getPayloadForSetOrRegisterSetValueRequest,
  makeGrpcCall,
} from '../../shared/GrpcCall';
import { ISetOrRegisterBase } from '../../shared/ISetOrRegisterBase';
import { handleSetOrRegisterGrpcResponse } from '../../shared/SetAndRegisterUtils';

export class GSetProxy<T extends string | number | object>
  implements ISetOrRegisterBase<T>, ICrdtProxy
{
  protected setGenericType: SetGenericType = SetGenericType.STRING;
  protected grpcService: SetServiceClient | undefined;
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

  static create<T extends string | number | object>(
    crdtName: string,
    statefulObject: StatefulObjectProxy,
    grpcService: SetServiceClient,
  ) {
    const instance = new GSetProxy<T>();
    instance.grpcService = grpcService;
    instance.config = {
      crdtName: crdtName,
      replicaId: statefulObject.config.replicaId,
      statefulObjectId: statefulObject.id(),
      crdtSetType: CRDTSetType.GSET,
      serverlessFunctionName: statefulObject.serverlessFunctionName(),
    };
    return instance;
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return this.values();
  }
  get type() {
    return 'GSetProxy';
  }
  async *values(): AsyncIterableIterator<T> {
    const v = await this.getValue();
    for (const value of v) {
      yield value;
    }
  }
  async has(value: T): Promise<boolean> {
    const values: T[] = await this.getValue();
    return values.includes(value);
  }
  get size() {
    return (async () => {
      const values = await this.getValue();
      return values.length;
    })();
  }

  async add(value: T): Promise<T[]> {
    if (value instanceof Number || typeof value === 'number') {
      this.setGenericType = SetGenericType.NUMBER;
    } else if (value instanceof String || typeof value === 'string') {
      this.setGenericType = SetGenericType.STRING;
    } else if (value instanceof Object || typeof value === 'object') {
      this.setGenericType = SetGenericType.OBJECT;
    } else {
      throw new Error('Unrecognized generic type');
    }

    const payload: SetOrRegisterSetValueRequest =
      getPayloadForSetOrRegisterSetValueRequest(
        value,
        this.setGenericType,
        this.config,
      );

    const response = await makeGrpcCall<
      SetOrRegisterSetValueRequest,
      SetOrRegisterValueResponse
    >((payload: any, callback: (err: any, response: any) => void) => {
      if (this.grpcService === undefined) {
        throw new Error(
          'Instance was not created via #create() factory method',
        );
      }
      this.grpcService.add(payload, callback);
    }, payload);
    return handleSetOrRegisterGrpcResponse(response);
  }
  async getValue(): Promise<T[]> {
    const payload: SetOrRegisterGetValueRequest = {
      functionBase: {
        serverlessFunctionName: this.config.serverlessFunctionName,
      },
      statefulObjectBase: {
        crdtName: this.config.crdtName,
        statefulObjectId: this.config.statefulObjectId,
      },
      replicaId: this.config.replicaId,
      type: this.setGenericType,
      crdtType: this.config.crdtSetType,
    };

    const response = await makeGrpcCall<
      SetOrRegisterGetValueRequest,
      SetOrRegisterValueResponse
    >((payload: any, callback: (err: any, response: any) => void) => {
      if (this.grpcService === undefined) {
        throw new Error(
          'Instance was not created via #create() factory method',
        );
      }
      this.grpcService.getValue(payload, callback);
    }, payload);

    return handleSetOrRegisterGrpcResponse(response);
  }
}
