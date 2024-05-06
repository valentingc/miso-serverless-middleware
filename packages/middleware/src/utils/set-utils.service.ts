import { miso } from '@miso/common/dist/grpc/server/index.js';
import { GSet, MVRegister, OptORSet } from '@miso/crdt';
import { Injectable, Logger } from '@nestjs/common';
import { ObjectsService } from '../objects/objects.service.js';
import { StatefulObject } from '../objects/stateful-object.js';

@Injectable()
export class SetUtilsService {
  private readonly logger = new Logger(SetUtilsService.name);

  constructor(private objectService: ObjectsService) {}

  getResult<T>(
    statefulObject: StatefulObject,
    crdt: OptORSet<T> | GSet<T> | MVRegister<T>,
    type: miso.common.SetGenericType,
  ) {
    const result: miso.common.SetOrRegisterValueResponse = {
      statefulObjectBase: {
        crdtName: crdt.crdtName,
        statefulObjectId: statefulObject.id,
      },
      type: type,
    };
    if (type === miso.common.SetGenericType.STRING) {
      result.valuesString = {
        values: Array.from(crdt.get()) as Array<string>,
      };
    } else if (type === miso.common.SetGenericType.NUMBER) {
      result.valuesNumber = {
        values: Array.from(crdt.get()) as Array<number>,
      };
    } else if (type === miso.common.SetGenericType.OBJECT) {
      result.valuesObject = {
        values: Array.from(crdt.get()) as Array<object>,
      };
    } else {
      result.valuesString = {
        values: Array.from(crdt.get()) as Array<any>,
      };
    }
    return result;
  }
  getValuesFromRequest(
    request: miso.replication.MVRegisterUpdate,
  ): Set<string | number | object> {
    switch (request.type) {
      case miso.common.SetGenericType.STRING:
        return new Set<string>(request.valuesString?.values);
      case miso.common.SetGenericType.NUMBER:
        return new Set<number>(request.valuesNumber?.values);
      case miso.common.SetGenericType.OBJECT:
        return new Set<object>(request.valuesObject?.values);

      default:
        throw new Error('Unsupported Set Type');
    }
  }
}
