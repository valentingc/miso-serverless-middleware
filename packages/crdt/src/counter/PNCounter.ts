import { StateBasedCRDT } from '../common/StateBasedCRDT.abstract';
import { GCounter } from './GCounter';

export class PNCounter extends StateBasedCRDT {
  private positiveCounter: GCounter;
  private negativeCounter: GCounter;

  constructor(
    statefulObjectId: string,
    crdtName: string,
    createFromValuesMap?: {
      positiveValuesMap: Map<string, number>;
      negativeValuesMap: Map<string, number>;
    },
  ) {
    super(statefulObjectId, crdtName);

    this.positiveCounter = createFromValuesMap
      ? new GCounter(
          statefulObjectId,
          crdtName + '-negative',
          createFromValuesMap.positiveValuesMap,
        )
      : new GCounter(statefulObjectId, crdtName + '-positive');
    this.negativeCounter = createFromValuesMap
        ? new GCounter(
            statefulObjectId,
            crdtName + '-negative',
            createFromValuesMap.negativeValuesMap,
          )
        : new GCounter(statefulObjectId, crdtName + '-negative');
  }

  add(replicaName: string, value: number): void {
    this.positiveCounter.add(replicaName, value);
  }
  subtract(replicaName: string, value: number): void {
    this.negativeCounter.add(replicaName, value);
  }

  get(): number {
    return this.positiveCounter.get() - this.negativeCounter.get();
  }
  get valuesMapPositive(): Map<string, number> {
    return this.positiveCounter.valuesMap;
  }
  get valuesMapNegative(): Map<string, number> {
    return this.negativeCounter.valuesMap;
  }

  merge(other: PNCounter): void {
    this.positiveCounter.merge(other.positiveCounter);
    this.negativeCounter.merge(other.negativeCounter);
  }
}
