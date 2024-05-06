import { StateBasedCRDT } from '@miso/crdt/src/common/StateBasedCRDT.abstract';
import { Logger } from '@nestjs/common';

export class StatefulObject {
  private _id: string;
  private _serverlessFunctionName: string;
  private crdtMap: Map<string, StateBasedCRDT>;
  private logger: Logger = new Logger(StatefulObject.name);

  constructor(id: string, serverlessFunctionName: string) {
    this._id = id;
    this._serverlessFunctionName = serverlessFunctionName;
    this.crdtMap = new Map();
  }
  get id() {
    return this._id;
  }
  get serverlessFunctionName() {
    return this._serverlessFunctionName;
  }

  hasCrdt(name: string): boolean {
    return this.crdtMap.has(name);
  }

  addCrdt<T extends StateBasedCRDT>(name: string, crdt: T): void {
    this.logger.verbose(`Adding CRDT with name: ${name}`);

    this.crdtMap.set(name, crdt);
  }

  getCrdt<T extends StateBasedCRDT>(name: string) {
    const crdt = this.crdtMap.get(name);
    if (crdt === undefined) {
      throw new Error('CRDT not found');
    }
    return crdt as T;
  }

  removeCrdt(name: string) {
    const crdt = this.crdtMap.get(name);
    if (crdt === undefined) {
      return false;
    }
    this.crdtMap.delete(name);
    return true;
  }

  getAllCrdts() {
    return new Map<string, StateBasedCRDT>(this.crdtMap);
  }
}
