import { IEvent } from './event.interface.js';

export class PodRefreshRequestEvent implements IEvent {
  constructor(
    private _namespace: string,
    private _serverlessFunctionName: string,
  ) {}

  get namespace() {
    return this._namespace;
  }

  get serverlessFunctionName() {
    return this._serverlessFunctionName;
  }
}
