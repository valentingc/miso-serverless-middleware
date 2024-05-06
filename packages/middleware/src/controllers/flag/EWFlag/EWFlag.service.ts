import { miso } from '@miso/common/dist/grpc/server/index.js';
import { EnableWinsFlag, VectorClock } from '@miso/crdt';
import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StatefulObject } from '../../../objects/stateful-object.js';
import { ReplicationService } from '../../../replication/replication.service.js';
import { getStatefulObjectInformation } from '../../../utils/controller-utils.js';
import { CrdtType } from '../../../utils/crdt-type.enum.js';
import {
  CrdtUtilsService,
  isEWFlag,
} from '../../../utils/crdt-utils.service.js';
import { jsonMapReplacer } from '../../../utils/json.utils.js';

@Injectable()
export class EWFlagService {
  protected logger: Logger = new Logger(EWFlagService.name);
  constructor(
    private readonly replicationService: ReplicationService,
    private readonly crdtService: CrdtUtilsService,
  ) {
    this.merge = this.merge.bind(this);
  }

  private _getCrdt(
    statefulObject: StatefulObject,
    crdtName: string,
    serverlessFunctionName: string,
  ) {
    const crdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      miso.common.CRDTSetType.EWFLAG,
      serverlessFunctionName,
    );
    if (!isEWFlag(crdt)) {
      throw new Error("CRDT is not of type 'EWFlag'");
    }
    return crdt;
  }
  getValue(
    request: miso.middleware.CounterGetValueRequest,
    statefulObject: StatefulObject,
  ):
    | miso.common.FlagSetValueReponse
    | Promise<miso.common.FlagSetValueReponse>
    | Observable<miso.common.FlagSetValueReponse> {
    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);
    const crdt = this._getCrdt(
      statefulObject,
      crdtName,
      serverlessFunctionName,
    );

    return {
      statefulObjectBase: {
        crdtName: crdtName,
        statefulObjectId: statefulObject.id,
      },
      value: crdt.get(),
    };
  }

  retrieveEWFlag(
    request: miso.common.CounterInitRequest,
    statefulObject: StatefulObject,
  ):
    | miso.replication.RetrieveEWFlagResponse
    | Promise<miso.replication.RetrieveEWFlagResponse>
    | Observable<miso.replication.RetrieveEWFlagResponse> {
    const crdtName = request.statefulObjectBase?.crdtName;
    if (crdtName === undefined) {
      throw new Error('CRDT name is undefined');
    }

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
    const crdt = this._getCrdt(
      statefulObject,
      crdtName,
      statefulObject.serverlessFunctionName,
    );
    const update = this._getUpdatePayload(crdt, statefulObject);
    return {
      hasValue: {
        response: true,
      },
      value: update,
    };
  }

  private _getUpdatePayload(
    crdt: EnableWinsFlag,
    statefulObject: StatefulObject,
  ) {
    const timeMS = Date.now();
    const update: miso.replication.EWFlagUpdate = {
      statefulObjectBase: {
        crdtName: crdt.crdtName,
        statefulObjectId: statefulObject.id,
      },
      functionBase: {
        serverlessFunctionName: statefulObject.serverlessFunctionName,
      },
      sentAtUtc: {
        seconds: timeMS / 1000,
        nanos: (timeMS % 1000) * 1e6,
      },

      srcCurrentValue: crdt.get(),
      vectorClock: {
        srcVectorClock: Object.fromEntries(
          crdt.getVectorClock().getMapEntries(),
        ),
      },
    };
    return update;
  }
  assign(
    request: miso.middleware.FlagSetValueRequest,
    statefulObject: StatefulObject,
  ):
    | miso.common.FlagSetValueReponse
    | Promise<miso.common.FlagSetValueReponse>
    | Observable<miso.common.FlagSetValueReponse> {
    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);

    const crdt = this._getCrdt(
      statefulObject,
      crdtName,
      serverlessFunctionName,
    );
    crdt.assign(request.value, request.replicaId);

    const update = this._getUpdatePayload(crdt, statefulObject);

    this.replicationService.queueReplicationTask({
      crdtName: update.statefulObjectBase?.crdtName ?? 'unknown',
      statefulObjectId:
        update.statefulObjectBase?.statefulObjectId ?? 'unknown',
      crdtType: CrdtType.EWFlag,
      grpcMethod: 'mergeEwFlag',
      payload: update,
      serverlessFunctionName: serverlessFunctionName,
      retryCount: 0,
    });
    return {
      statefulObjectBase: {
        crdtName: crdtName,
        statefulObjectId: statefulObject.id,
      },
      value: crdt.get(),
    };
  }

  async merge(
    request: miso.replication.EWFlagUpdate,
    statefulObject: StatefulObject,
  ): Promise<miso.common.FlagSetValueReponse> {
    this.logger.debug(
      'EWFlag MERGE UPDATE REQUEST: ' + JSON.stringify(request),
    );

    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);
    const crdt = this._getCrdt(
      statefulObject,
      crdtName,
      serverlessFunctionName,
    );

    const srcVectorClockObj = request.vectorClock?.srcVectorClock ?? {};

    if (crdtName === undefined) {
      throw new Error(
        'crdtName is undefined for request: ' +
          JSON.stringify(request, jsonMapReplacer),
      );
    }

    const srcVectorClock: VectorClock = new VectorClock(
      new Map(
        Object.entries(srcVectorClockObj).map(([key, value]) => [
          key,
          Number(value),
        ]),
      ),
    );

    const srcEWFlag = new EnableWinsFlag(
      statefulObject.id,
      crdtName,
      request.srcCurrentValue,
      srcVectorClock,
    );

    this.logger.verbose(
      'has concurrent write? ' + crdt.hasConcurrentWriteWith(srcEWFlag),
    );
    this.logger.verbose(
      'hasOtherCrdtNewerWrites? ' + crdt.hasOtherCrdtNewerWrites(srcEWFlag),
    );
    this.logger.verbose(
      'Merging CRDT of merge message: ' +
        JSON.stringify(srcEWFlag, jsonMapReplacer),
    );
    this.logger.verbose('This CRDT: ' + JSON.stringify(crdt, jsonMapReplacer));
    crdt.merge(srcEWFlag);
    this.logger.verbose(
      'Merged CRDT value: ' +
        crdt.get() +
        ' , json: ' +
        JSON.stringify(crdt, jsonMapReplacer),
    );
    return {
      statefulObjectBase: {
        crdtName: crdtName,
        statefulObjectId: statefulObject.id,
      },
      value: crdt.get(),
    };
  }
}
