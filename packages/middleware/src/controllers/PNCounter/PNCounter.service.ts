import { miso } from '@miso/common/dist/grpc/server/index.js';
import { PNCounter } from '@miso/crdt';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MiddlewareConfig } from '../../config/middleware-config.js';
import { StatefulObject } from '../../objects/stateful-object.js';
import { MergeableCrdtService } from '../../replication/mergeable-crdt-service.interface.js';
import { ReplicationMetricsService } from '../../replication/replication-metrics.service.js';
import { ReplicationService } from '../../replication/replication.service.js';
import { getStatefulObjectInformation } from '../../utils/controller-utils.js';
import { CrdtType } from '../../utils/crdt-type.enum.js';
import {
  CrdtUtilsService,
  isPNCounter,
} from '../../utils/crdt-utils.service.js';

@Injectable()
export class PNCounterService implements MergeableCrdtService {
  protected logger: Logger = new Logger(PNCounterService.name);

  constructor(
    private readonly replicationService: ReplicationService,
    readonly configService: ConfigService<MiddlewareConfig>,
    private readonly crdtService: CrdtUtilsService,
    private readonly replicationMetricsService: ReplicationMetricsService,
  ) {
    this.merge = this.merge.bind(this);
  }

  _getPNCounter(
    statefulObject: StatefulObject,
    crdtName: string,
    serverlessFunctionName: string,
  ) {
    const crdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      miso.common.CRDTSetType.PNCOUNTER,
      serverlessFunctionName,
    );

    if (!isPNCounter(crdt)) {
      throw new Error('CRDT has the wrong type');
    }
    return crdt;
  }

  async merge(
    request: miso.replication.PNCounterUpdate,
    statefulObject: StatefulObject,
  ): Promise<miso.common.CounterResponse> {
    const start = Date.now();
    this.logger.debug('PNCounter merge request: ' + JSON.stringify(request));
    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);
    const crdt = this._getPNCounter(
      statefulObject,
      crdtName,
      serverlessFunctionName,
    );
    if (request.srcMapPositive === undefined) {
      request.srcMapPositive = {};
    }
    if (request.srcMapNegative === undefined) {
      request.srcMapNegative = {};
    }
    const srcPositiveMap: Map<string, number> = new Map(
      Object.entries(request.srcMapPositive).map(([key, value]) => [
        key,
        Number(value),
      ]),
    );
    const srcNegativeMap: Map<string, number> = new Map(
      Object.entries(request.srcMapNegative).map(([key, value]) => [
        key,
        Number(value),
      ]),
    );

    const newCrdt: PNCounter = new PNCounter(statefulObject.id, crdtName, {
      negativeValuesMap: srcNegativeMap,
      positiveValuesMap: srcPositiveMap,
    });
    crdt.merge(newCrdt);
    this.logger.debug('New PNCounter merged: ' + JSON.stringify(crdt));
    this.replicationMetricsService.recordReplicationProcessingTime(
      Date.now() - start,
    );
    return {
      statefulObjectBase: {
        crdtName: crdtName,
        statefulObjectId: statefulObject.id,
      },
      value: -1,
    };
  }
  retrievePNCounter(
    crdtName: string,
    statefulObject: StatefulObject,
  ): miso.replication.RetrievePNCounterResponse {
    const timeMS = Date.now();
    if (statefulObject.hasCrdt(crdtName) === false) {
      this.logger.log(
        'CRDT with the name: ' +
          crdtName +
          ' does not exist in the stateful object with id: ' +
          statefulObject.id,
      );
      return {
        hasValue: {
          response: false,
        },
      };
    }
    const crdt = statefulObject.getCrdt(crdtName) as PNCounter;

    const crdtMapAsObjectPos = Object.fromEntries(
      crdt.valuesMapPositive.entries(),
    );
    const crdtMapAsObjectNegative = Object.fromEntries(
      crdt.valuesMapNegative.entries(),
    );
    const update: miso.replication.RetrievePNCounterResponse = {
      value: {
        functionBase: {
          serverlessFunctionName: statefulObject.serverlessFunctionName,
        },
        statefulObjectBase: {
          statefulObjectId: statefulObject.id,
          crdtName: crdtName,
        },

        sentAtUtc: {
          seconds: timeMS / 1000,
          nanos: (timeMS % 1000) * 1e6,
        },
        srcCurrentValue: crdt.get(),
        srcMapPositive: crdtMapAsObjectPos,
        srcMapNegative: crdtMapAsObjectNegative,
      },
      hasValue: {
        response: true,
      },
    };

    return update;
  }

  _getPNCounterUpdate(
    request: miso.middleware.CounterAddOrSubtractValueRequest,
    crdt: PNCounter,
    statefulObject: StatefulObject,
  ) {
    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);
    const timeMS = Date.now();
    const crdtMapAsObjectPos = Object.fromEntries(
      crdt.valuesMapPositive.entries(),
    );
    const crdtMapAsObjectNegative = Object.fromEntries(
      crdt.valuesMapNegative.entries(),
    );
    const update: miso.replication.PNCounterUpdate = {
      functionBase: {
        serverlessFunctionName: serverlessFunctionName,
      },
      statefulObjectBase: {
        statefulObjectId: statefulObject.id,
        crdtName: crdtName,
      },

      sentAtUtc: {
        seconds: timeMS,
        nanos: (timeMS % 1000) * 1e6,
      },
      srcCurrentValue: crdt.get(),
      srcMapPositive: crdtMapAsObjectPos,
      srcMapNegative: crdtMapAsObjectNegative,
    };
    return update;
  }
  async add(
    request: miso.middleware.CounterAddOrSubtractValueRequest,
    statefulObject: StatefulObject,
  ): Promise<miso.common.CounterResponse> {
    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);
    const crdt = this._getPNCounter(
      statefulObject,
      crdtName,
      serverlessFunctionName,
    );

    crdt.add(request.replicaId, request.value);
    const update = this._getPNCounterUpdate(request, crdt, statefulObject);
    await this.replicationService.queueReplicationTask({
      crdtName: update.statefulObjectBase?.crdtName ?? 'unknown',
      statefulObjectId:
        update.statefulObjectBase?.statefulObjectId ?? 'unknown',
      crdtType: CrdtType.PNCounter,
      grpcMethod: 'mergePnCounter',
      payload: update,
      serverlessFunctionName: serverlessFunctionName,
      retryCount: 0,
    });
    return {
      statefulObjectBase: {
        crdtName: crdt.crdtName,
        statefulObjectId: statefulObject.id,
      },
      value: crdt.get(),
    };
  }
  subtract(
    request: miso.middleware.CounterAddOrSubtractValueRequest,
    statefulObject: StatefulObject,
  ): miso.common.CounterResponse {
    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);
    const crdt = this._getPNCounter(
      statefulObject,
      crdtName,
      serverlessFunctionName,
    );

    crdt.subtract(request.replicaId, request.value);
    const update = this._getPNCounterUpdate(request, crdt, statefulObject);
    this.replicationService.queueReplicationTask({
      crdtName: update.statefulObjectBase?.crdtName ?? 'unknown',
      statefulObjectId:
        update.statefulObjectBase?.statefulObjectId ?? 'unknown',
      crdtType: CrdtType.PNCounter,
      grpcMethod: 'mergePnCounter',
      payload: update,
      serverlessFunctionName: serverlessFunctionName,
      retryCount: 0,
    });

    return {
      statefulObjectBase: {
        crdtName: crdt.crdtName,
        statefulObjectId: statefulObject.id,
      },
      value: crdt.get(),
    };
  }

  getValue(
    request: miso.middleware.CounterGetValueRequest,
    statefulObject: StatefulObject,
  ): miso.common.CounterResponse {
    const { crdtName } = getStatefulObjectInformation(request);

    const crdt = this._getPNCounter(
      statefulObject,
      crdtName,
      statefulObject.serverlessFunctionName,
    );

    return {
      statefulObjectBase: {
        crdtName: crdt.crdtName,
        statefulObjectId: statefulObject.id,
      },
      value: crdt.get(),
    };
  }
}
