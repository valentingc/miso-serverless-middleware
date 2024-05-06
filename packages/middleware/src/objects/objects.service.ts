import { Injectable, Logger } from '@nestjs/common';
import { StatefulObject } from './stateful-object.js';
@Injectable()
export class ObjectsService {
  private objectMap: Map<string, StatefulObject[]>;
  private logger: Logger = new Logger(ObjectsService.name);
  constructor() {
    this.objectMap = new Map<string, StatefulObject[]>();
  }

  hasStatefulObject(serverlessFunctionName: string, id: string) {
    const statefulObjects = this.objectMap.get(serverlessFunctionName);
    if (statefulObjects === undefined) {
      return false;
    }
    return statefulObjects.some((object) => object.id === id);
  }

  getStatefulObjectCount(serverlessFunctionName: string) {
    const statefulObjects = this.objectMap.get(serverlessFunctionName);
    if (statefulObjects === undefined) {
      return 0;
    }
    return statefulObjects.length;
  }

  delete(id: string, serverlessFunctionName: string) {
    let statefulObjects = this.objectMap.get(serverlessFunctionName);
    if (statefulObjects === undefined) {
      return false;
    }
    const so = statefulObjects.find((object) => object.id === id);
    if (so === undefined) {
      return false;
    }
    statefulObjects = statefulObjects.filter((object) => object.id !== id);
    this.objectMap.set(serverlessFunctionName, statefulObjects);
    return true;
  }
  createStatefulObject(id: string, serverlessFunctionName: string) {
    this.logger.log(
      `Creating new stateful object for function: '${serverlessFunctionName}'`,
    );
    const so: StatefulObject = new StatefulObject(id, serverlessFunctionName);
    const statefulObjects = this.objectMap.get(serverlessFunctionName) ?? [];
    statefulObjects.push(so);
    this.objectMap.set(serverlessFunctionName, statefulObjects);
    return so;
  }
  getStatefulObject(id: string, serverlessFunctionName: string) {
    const statefulObjects = this.objectMap.get(serverlessFunctionName);

    const so = (statefulObjects ?? []).find((object) => object.id === id);
    if (statefulObjects === undefined || so === undefined) {
      throw new Error(
        'Could not find stateful object for id: ' +
          id +
          " and/or serverless function: '" +
          serverlessFunctionName +
          "'",
      );
    }

    return so;
  }

  getAllStatefulObjects(serverlessFunctionName: string) {
    return this.objectMap.get(serverlessFunctionName) || [];
  }
}
