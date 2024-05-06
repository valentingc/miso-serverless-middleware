import { StateBasedCRDT } from '../common/StateBasedCRDT.abstract';

export class GSet<T>
  extends StateBasedCRDT
  implements Omit<Set<T>, 'clear' | 'delete' | 'add'>
{
  protected valuesSet: Set<T>;

  constructor(statefulObjectId: string, crdtName: string, values?: Set<T>) {
    super(statefulObjectId, crdtName);
    this.valuesSet = values ?? new Set<T>();
  }

  add(value: T): this {
    if (value != null && typeof value === 'object') {
      if (!('id' in value)) {
        throw Error(
          'If value of GSet is an object, object needs to have an ID.',
        );
      }
    }
    const valueAsAny = <any>value;
    const alreadyAdded =
      typeof value !== 'object'
        ? this.valuesSet.has(value)
        : (Array.from(this.valuesSet.keys()).find(
            (val) => (<any>val).id === valueAsAny.id,
          ) as T) !== undefined;

    if (alreadyAdded === false) {
      this.valuesSet.add(value);
    }
    return this;
  }

  get(): Set<T> {
    return this.valuesSet;
  }
  forEach(
    callbackfn: (value: T, value2: T, set: Set<T>) => void,
    thisArg?: any,
  ): void {
    return this.valuesSet.forEach(callbackfn, thisArg);
  }
  has(value: T): boolean {
    return this.valuesSet.has(value);
  }
  get size(): number {
    return this.valuesSet.size;
  }
  entries(): IterableIterator<[T, T]> {
    return this.valuesSet.entries();
  }
  keys(): IterableIterator<T> {
    return this.valuesSet.keys();
  }
  values(): IterableIterator<T> {
    return this.valuesSet.values();
  }
  [Symbol.iterator](): IterableIterator<T> {
    return this.valuesSet[Symbol.iterator]();
  }
  [Symbol.toStringTag] = 'GSet';

  merge(other: GSet<T>): void {
    other.valuesSet.forEach((val) => this.valuesSet.add(val));
  }
}
