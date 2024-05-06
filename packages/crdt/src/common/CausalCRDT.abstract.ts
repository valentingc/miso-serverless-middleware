import { StateBasedCRDT } from './StateBasedCRDT.abstract';
import { VectorClock, VectorClockComparison } from './VectorClock';

export abstract class CausalCRDT extends StateBasedCRDT {
  protected vectorClock: VectorClock;

  constructor(sOId: string, crdtName: string, vectorClock?: VectorClock) {
    super(sOId, crdtName);
    this.vectorClock = vectorClock ?? new VectorClock();
  }

  getVectorClock(): VectorClock {
    return this.vectorClock;
  }
  hasOtherCrdtNewerWrites(other: CausalCRDT): boolean {
    return (
      this.vectorClock.compare(other.vectorClock) ===
      VectorClockComparison.OTHER_CLOCK_IS_GREATER
    );
  }

  hasConcurrentWriteWith(other: CausalCRDT): boolean {
    return (
      this.vectorClock.compare(other.vectorClock) ===
      VectorClockComparison.CONCURRENT
    );
  }
}
