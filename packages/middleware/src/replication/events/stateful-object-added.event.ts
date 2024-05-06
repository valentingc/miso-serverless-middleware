import { IEvent } from './event.interface.js';

export class StatefulObjectAddedEvent implements IEvent {
  serverlessFunctionName: string;
  statefulObjectId: string;

  constructor(values: {
    serverlessFunctionName: string;
    statefulObjectId: string;
  }) {
    this.serverlessFunctionName = values.serverlessFunctionName;
    this.statefulObjectId = values.statefulObjectId;
  }
}
