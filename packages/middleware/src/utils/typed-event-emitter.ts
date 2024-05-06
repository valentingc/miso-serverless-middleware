import EventEmitter from 'events';

export class TypedEventEmitter<Events> {
  private _emitter = new EventEmitter();

  on<K extends keyof Events>(
    event: K,
    listener: (payload: Events[K]) => void,
  ): this {
    this._emitter.on(event as string, listener);
    return this;
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): boolean {
    return this._emitter.emit(event as string, payload);
  }

  removeAllListeners<K extends keyof Events>(event?: K): void {
    this._emitter.removeAllListeners(event as string);
  }
}
