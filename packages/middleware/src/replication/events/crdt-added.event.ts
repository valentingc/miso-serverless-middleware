import { IEvent } from './event.interface.js';

export class CrdtAddedEvent implements IEvent {
  crdtName: string;
  statefulObjectId: string;
  serverlessFunctionName: string;
  constructor(values: {
    crdtName: string;
    statefulObjectId: string;
    serverlessFunctionName: string;
  }) {
    this.crdtName = values.crdtName;
    this.statefulObjectId = values.statefulObjectId;
    this.serverlessFunctionName = values.serverlessFunctionName;
  }
}
