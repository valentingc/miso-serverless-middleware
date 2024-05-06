import { IEvent } from '../../../../../../../replication/events/event.interface.js';

export class NodeRefreshRequestEvent implements IEvent {
  constructor(private _middlewareNamespace: string) {}

  get middlewareNamespace() {
    return this._middlewareNamespace;
  }
}
