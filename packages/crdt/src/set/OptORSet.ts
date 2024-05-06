import { CausalCRDT } from '../common/CausalCRDT.abstract';
import { VectorClock } from '../common/VectorClock';
export interface ObjectWithId {
  id: string;
}

// https://arxiv.org/abs/1210.3368
export class OptORSet<T> extends CausalCRDT implements Omit<Set<T>, 'add'> {
  private elements: Map<T, ReplicaVersion>;

  constructor(
    statefulObjectId: string,
    crdtName: string,
    map?: Map<T, ReplicaVersion>,
    vectorClock?: VectorClock,
  ) {
    super(statefulObjectId, crdtName, vectorClock);
    this.elements = map ?? new Map<T, ReplicaVersion>();
  }

  get size(): number {
    return this.elements.size;
  }

  clear(): void {
    this.elements.clear();
  }
  delete(value: T): boolean {
    return this.elements.delete(value);
  }
  forEach(
    callbackfn: (value: T, value2: T, set: Set<T>) => void,
    thisArg?: any,
  ): void {
    for (const [key] of this.elements.entries()) {
      callbackfn(key, key, thisArg);
    }
  }

  [Symbol.iterator](): IterableIterator<T> {
    const keys = this.elements.keys();
    return {
      [Symbol.iterator]: () => ({
        next: () => {
          const entry = keys.next();
          if (entry.done) {
            return { done: true, value: undefined as unknown as T };
          }
          return { done: false, value: entry.value };
        },
      }),
    } as IterableIterator<T>;
  }
  [Symbol.toStringTag] = 'OptORSet';

  keys(): IterableIterator<T> {
    return this.elements.keys();
  }
  values(): IterableIterator<T> {
    return this.elements.keys();
  }

  entries(): IterableIterator<[T, T]> {
    function* entryGenerator(
      elements: Map<T, ReplicaVersion>,
    ): IterableIterator<[T, T]> {
      for (const key of elements.keys()) {
        yield [key, key];
      }
    }
    return entryGenerator(this.elements);
  }

  has(value: T) {
    return typeof value !== 'object'
      ? this.elements.has(value)
      : (Array.from(this.elements.keys()).find(
          (val) => (<any>val).id === (<any>value).id,
        ) as T) !== undefined;
  }

  add(value: T, replicaId: string): boolean {
    if (value != null && typeof value === 'object') {
      if ('id' in value === false) {
        throw Error(
          'If value of ORSet is an object, object needs to have an ID.',
        );
      }
    }
    const version = this.vectorClock.increment(replicaId);
    const replicaVersion: ReplicaVersion = {
      replicaId: replicaId,
      version: version,
    };

    const valueAsAny = <any>value;
    const alreadyAdded =
      typeof value !== 'object'
        ? this.elements.has(value)
        : (Array.from(this.elements.keys()).find(
            (val) => (<any>val).id === valueAsAny.id,
          ) as T) !== undefined;

    if (
      (typeof value === 'object' && alreadyAdded === false) ||
      typeof value !== 'object'
    ) {
      this.elements.set(value, replicaVersion);
    }

    return !alreadyAdded;
  }

  remove(value: T): boolean {
    if (typeof value === 'object') {
      const valueAsAny = value as any;
      if (!('id' in valueAsAny)) {
        throw new Error('Need to have the id property set to delete objects');
      }
      value = Array.from(this.elements.keys()).find(
        (val) => (<any>val).id === valueAsAny.id,
      ) as T;
    }
    return this.elements.delete(value);
  }

  get(): Set<T> {
    return new Set(this.elements.keys());
  }

  getElements(): Map<T, ReplicaVersion> {
    return new Map<T, ReplicaVersion>(this.elements);
  }

  merge(incoming: OptORSet<T>): void {
    const incomingVectorClock = incoming.vectorClock;
    const incomingElements = incoming.elements;

    for (const [key, incomingReplicaVersion] of incomingElements) {
      if (this.elements.has(key) === false) {
        // the element is present in the incoming set, but not in the local set
        if (
          incomingReplicaVersion.version <
          this.vectorClock.getVersion(incomingReplicaVersion.replicaId)
        ) {
          console.log(
            `Skipping incoming value (local has newer clock): ${key}`,
          );
          continue;
        }
      }
      const entry: ReplicaVersion = {
        replicaId: incomingReplicaVersion.replicaId,
        version: incomingReplicaVersion.version,
      };
      this.elements.set(key, entry);
    }

    for (const [key, thisReplicaVersion] of this.elements) {
      if (!incomingElements.has(key)) {
        // the element is present in the local set, but not in the incoming set
        if (
          thisReplicaVersion.version <
          incomingVectorClock.getVersion(thisReplicaVersion.replicaId)
        ) {
          console.log(`Removing value (incoming has newer clock): ${key}`);
          this.elements.delete(key);
        }
      }
    }

    this.vectorClock.merge(incomingVectorClock);
  }
}
export class ORSetElement<T> {
  constructor(private _tag: string, private _element: T) {}

  get tag(): string {
    return this._tag;
  }

  get element(): T {
    return this._element;
  }
}

export type ReplicaVersion = {
  replicaId: string;
  version: number;
};
