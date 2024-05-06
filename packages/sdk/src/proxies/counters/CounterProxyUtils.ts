import { CRDTSetType } from '@miso/common/dist/grpc/client/miso/common/CRDTSetType.js';
import { CounterAddOrSubtractValueRequest } from '@miso/common/dist/grpc/client/miso/middleware/CounterAddOrSubtractValueRequest';
import { GCounterServiceClient } from '@miso/common/dist/grpc/client/miso/middleware/GCounterService';
import { PNCounterServiceClient } from '@miso/common/dist/grpc/client/miso/middleware/PNCounterService';
import { ICrdtProxy } from '../ICrdtProxy.js';

export class CounterProxyUtils implements Pick<ICrdtProxy, 'config'> {
  constructor(
    private grpcService: PNCounterServiceClient | GCounterServiceClient,
    public config: {
      crdtName: string;
      serverlessFunctionName: string;
      replicaId: string;
      statefulObjectId: string;
      crdtSetType: CRDTSetType;
    },
  ) {}

  private getPayload(value: number): CounterAddOrSubtractValueRequest {
    return {
      functionBase: {
        serverlessFunctionName: this.config.serverlessFunctionName,
      },
      statefulObjectBase: {
        crdtName: this.config.crdtName,
        statefulObjectId: this.config.statefulObjectId,
      },

      replicaId: this.config.replicaId,
      value: value,
    };
  }

  add(value: number): Promise<number> {
    return new Promise<number>((resolve, reject) =>
      this.grpcService.add(this.getPayload(value), (err, response) => {
        if (err) {
          return reject(err);
        }
        if (response === undefined) {
          throw new Error('No response');
        }
        resolve(Number(response.value));
      }),
    );
  }
  subtract(value: number): Promise<number> {
    if (!('subtract' in this.grpcService)) {
      throw Error('Only PNCounter is able to decrement');
    }
    return new Promise<number>((resolve, reject) =>
      (<PNCounterServiceClient>this.grpcService).subtract(
        this.getPayload(value),
        (err, response) => {
          if (err) {
            return reject(err);
          }
          if (response === undefined) {
            throw new Error('No response');
          }
          resolve(Number(response.value));
        },
      ),
    );
  }
  getValue(): Promise<number> {
    return new Promise<number>((resolve, reject) =>
      this.grpcService.getValue(
        {
          functionBase: {
            serverlessFunctionName: this.config.serverlessFunctionName,
          },
          statefulObjectBase: {
            crdtName: this.config.crdtName,
            statefulObjectId: this.config.statefulObjectId,
          },
        },
        (err, response) => {
          if (err) {
            return reject(err);
          }
          if (response === undefined) {
            throw new Error('No response');
          }
          resolve(Number(response.value));
        },
      ),
    );
  }
}
