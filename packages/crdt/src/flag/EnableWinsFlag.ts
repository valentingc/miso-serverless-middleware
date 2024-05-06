import { CausalCRDT } from '../common/CausalCRDT.abstract';
import { VectorClock, VectorClockComparison } from '../common/VectorClock';

export class EnableWinsFlag extends CausalCRDT {
  private value: boolean;

  constructor(
    statefulObjectId: string,
    crdtName: string,
    currentValue?: boolean,
    vectorClock?: VectorClock,
  ) {
    super(statefulObjectId, crdtName, vectorClock);
    this.value = currentValue ?? true;
  }

  assign(value: boolean, replicaId: string): void {
    this.vectorClock.increment(replicaId);
    this.value = value;
  }

  get(): boolean {
    return this.value;
  }

  merge(other: EnableWinsFlag): void {
    const comparison = this.vectorClock.compare(other.vectorClock);
    // In case of concurrent updates, enable wins
    if (comparison === VectorClockComparison.CONCURRENT) {
      this.value = this.value || other.value;
    } else if (comparison === VectorClockComparison.OTHER_CLOCK_IS_GREATER) {
      this.value = other.value;
    }

    this.vectorClock.merge(other.vectorClock);
  }
}
