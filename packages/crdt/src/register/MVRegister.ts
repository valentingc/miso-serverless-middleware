import { CausalCRDT } from '../common/CausalCRDT.abstract';
import { VectorClock } from '../common/VectorClock';

export class MVRegister<T> extends CausalCRDT {
  private values: Set<T>;

  constructor(
    statefulObjId: string,
    crdtName: string,
    values?: Set<T>,
    vectorClock?: VectorClock,
  ) {
    super(statefulObjId, crdtName, vectorClock);
    this.values = values ?? new Set<T>();
  }

  assign(value: T, replicaId: string): boolean {
    this.vectorClock.increment(replicaId);
    this.values.clear();
    this.values.add(value);
    return true;
  }

  clear(): void {
    this.values.clear();
  }

  get(): Set<T> {
    return this.values;
  }

  merge(other: MVRegister<T>): void {
    if (this.hasConcurrentWriteWith(other)) {
      // write conflict
      other.values.forEach((val) => this.values.add(val));
    }

    if (this.hasOtherCrdtNewerWrites(other)) {
      this.values.clear();
      other.values.forEach((val) => this.values.add(val));
    }

    this.vectorClock.merge(other.vectorClock);
  }
}
