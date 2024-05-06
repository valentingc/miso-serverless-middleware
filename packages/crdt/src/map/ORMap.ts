import { CausalCRDT } from '../common/CausalCRDT.abstract';
import { StateBasedCRDT } from '../common/StateBasedCRDT.abstract';
import { VectorClock } from '../common/VectorClock';
import { OptORSet } from '../set/OptORSet';

type IORMap<K, V> = Omit<Map<K, V>, 'set'>;

export class ORMap<K extends number | string | object, V extends StateBasedCRDT>
  extends CausalCRDT
  implements IORMap<K, V>
{
  private mapElements: Map<K, V>;
  private mapKeys: OptORSet<K>;
  [Symbol.iterator] = this.entries;
  [Symbol.toStringTag] = 'ORMap';

  constructor(
    statefulObjectId: string,
    crdtName: string,
    map?: Map<K, V>,
    vectorClock?: VectorClock,
  ) {
    super(statefulObjectId, crdtName, vectorClock);
    this.mapElements = map ?? new Map<K, V>();
    this.mapKeys = new OptORSet(statefulObjectId, crdtName + '_keys');
  }

  values(): IterableIterator<V> {
    return this.mapElements.values();
  }
  entries(): IterableIterator<[K, V]> {
    return this.mapElements.entries();
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any,
  ): void {
    this.mapElements.forEach(callbackfn, thisArg);
  }

  keys(): IterableIterator<K> {
    return this.mapKeys.getElements().keys();
  }

  has(key: K) {
    return this.mapKeys.has(key);
  }

  get(key: K): V | undefined {
    return this.mapElements.get(key);
  }

  set(key: K, value: V, replicaId: string): this {
    this.mapKeys.add(key, replicaId);
    this.mapElements.set(key, value);
    return this;
  }

  clear() {
    this.mapElements = new Map<K, V>();
    this.mapKeys = new OptORSet<K>(
      this.statefulObjectId,
      this.crdtName + '_keys',
    );
  }

  delete(key: K): boolean {
    this.mapElements.delete(key);
    return this.mapKeys.remove(key);
  }

  get size(): number {
    return this.mapKeys.size;
  }

  merge(other: ORMap<K, V>): void {
    // From each OR-Map take their OR-Sets (used for keys) and merge them together. This will handle key addition/removal conflicts for us.

    const thisKeys = this.mapKeys;
    thisKeys.merge(other.mapKeys);

    for (const mapEntry of thisKeys.getElements()) {
      const key = mapEntry[0];
      const thisValue = this.mapElements.get(key);
      const otherValue = other.mapElements.get(key);

      if (thisValue && otherValue) {
        thisValue.merge(otherValue);
      } else if (!thisValue && otherValue) {
        this.mapElements.set(key, otherValue);
      }
    }
  }
}
