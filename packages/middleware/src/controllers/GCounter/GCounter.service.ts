import { miso } from '@miso/common/dist/grpc/server/index.js';
import { GCounter } from '@miso/crdt';
import { Injectable, Logger } from '@nestjs/common';
import { StatefulObject } from '../../objects/stateful-object.js';
import { MergeableCrdtService } from '../../replication/mergeable-crdt-service.interface.js';
import { ReplicationService } from '../../replication/replication.service.js';
import { getStatefulObjectInformation } from '../../utils/controller-utils.js';
import { CrdtType } from '../../utils/crdt-type.enum.js';
import {
  CrdtUtilsService,
  isGCounter,
} from '../../utils/crdt-utils.service.js';

@Injectable()
export class GCounterService implements MergeableCrdtService {
  protected logger: Logger = new Logger(GCounterService.name);
  constructor(
    private readonly replicationService: ReplicationService,
    private readonly crdtService: CrdtUtilsService,
  ) {
    this.merge = this.merge.bind(this);
  }

  retrieveGCounter(
    crdtName: string,
    statefulObject: StatefulObject,
  ): miso.replication.RetrieveGCounterResponse {
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
    const crdt = statefulObject.getCrdt(crdtName) as GCounter;
    const crdtMapAsObject = Object.fromEntries(crdt.valuesMap.entries());
    const update: miso.replication.GCounterUpdate = {
      statefulObjectBase: {
        statefulObjectId: statefulObject.id,
        crdtName: crdt.crdtName,
      },
      functionBase: {
        serverlessFunctionName: statefulObject.serverlessFunctionName,
      },
      sentAtUtc: {
        seconds: timeMS / 1000,
        nanos: (timeMS % 1000) * 1e6,
      },
      srcCurrentValue: crdt.get(),
      srcMap: crdtMapAsObject,
    };
    return {
      hasValue: {
        response: true,
      },
      value: update,
    };
  }

  getValue(
    request: miso.middleware.CounterGetValueRequest,
    statefulObject: StatefulObject,
  ): miso.common.CounterResponse {
    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);
    const crdt = this._getCRDT(
      statefulObject,
      crdtName,
      serverlessFunctionName,
    );
    return {
      statefulObjectBase: {
        crdtName: crdt.crdtName,
        statefulObjectId: statefulObject.id,
      },
      value: crdt.get(),
    };
  }

  add(
    request: miso.middleware.CounterAddOrSubtractValueRequest,
    statefulObject: StatefulObject,
  ): miso.common.CounterResponse {
    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);
    const crdt = this._getCRDT(
      statefulObject,
      crdtName,
      serverlessFunctionName,
    );

    crdt.add(request.replicaId, request.value);

    const timeMS = Date.now();

    const crdtMapAsObject = Object.fromEntries(crdt.valuesMap.entries());

    const update: miso.replication.GCounterUpdate = {
      statefulObjectBase: {
        statefulObjectId: statefulObject.id,
        crdtName: crdtName,
      },
      functionBase: {
        serverlessFunctionName: serverlessFunctionName,
      },
      sentAtUtc: {
        seconds: timeMS / 1000,
        nanos: (timeMS % 1000) * 1e6,
      },
      srcCurrentValue: crdt.get(),
      srcMap: crdtMapAsObject,
    };

    this.replicationService.queueReplicationTask({
      crdtName: update.statefulObjectBase?.crdtName ?? 'unknown',
      statefulObjectId:
        update.statefulObjectBase?.statefulObjectId ?? 'unknown',
      crdtType: CrdtType.GCOUNTER,
      grpcMethod: 'mergeGCounter',
      payload: update,
      serverlessFunctionName: serverlessFunctionName,
      retryCount: 0,
    });

    return {
      statefulObjectBase: {
        statefulObjectId: statefulObject.id,
        crdtName: crdt.crdtName,
      },
      value: crdt.get(),
    };
  }
  async merge(
    request: miso.replication.GCounterUpdate,
    statefulObject: StatefulObject,
  ): Promise<miso.common.CounterResponse> {
    this.logger.debug(
      'GCOUNTER MERGE UPDATE REQUEST: ' + JSON.stringify(request),
    );

    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);
    const crdt = this._getCRDT(
      statefulObject,
      crdtName,
      serverlessFunctionName,
    );
    const newMap: Map<string, number> = new Map(
      Object.entries(request.srcMap).map(([key, value]) => [
        key,
        Number(value),
      ]),
    );
    this.logger.verbose('newMap size: ' + newMap.size);

    const newCrdt: GCounter = new GCounter(statefulObject.id, crdtName, newMap);
    this.logger.verbose('NEW CRDT: ' + JSON.stringify(newCrdt));

    const mergedCrdtMapAsObj = Object.fromEntries(newCrdt.valuesMap.entries());
    this.logger.verbose(
      'mergedCrdtMapAsObj: ' + JSON.stringify(mergedCrdtMapAsObj),
    );

    crdt.merge(newCrdt);
    this.logger.debug('New GCounter merged');
    return {
      statefulObjectBase: {
        crdtName: crdt.crdtName,
        statefulObjectId: statefulObject.id,
      },
      value: crdt.get(),
    };
  }

  private _getCRDT(
    statefulObject: StatefulObject,
    crdtName: string,
    serverlessFunctionName: string,
  ) {
    const crdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      miso.common.CRDTSetType.GCOUNTER,
      serverlessFunctionName,
    );
    if (!isGCounter(crdt)) {
      throw new Error('CRDT has the wrong type: ' + crdt.constructor.name);
    }

    return crdt;
  }
}
