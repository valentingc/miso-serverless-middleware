import { StateBasedCRDT } from '../common/StateBasedCRDT.abstract';

export class GCounter extends StateBasedCRDT {
  private _valuesMap: Map<string, number>;

  constructor(
    statefulObjectId: string,
    crdtName: string,
    values?: Map<string, number>, //<replicaId, value>
  ) {
    super(statefulObjectId, crdtName);

    if (values !== undefined) {
      this._valuesMap = values;
    } else {
      this._valuesMap = new Map<string, number>();
    }
  }

  get valuesMap(): Map<string, number> {
    return this._valuesMap;
  }

  add(replicaId: string, value: number): void {
    if (value <= 0) {
      throw new Error('Cannot add negative number!');
    }

    let currentValue = this._valuesMap.get(replicaId);
    if (currentValue === undefined) {
      currentValue = 0;
    }
    const newValue = currentValue + value;
    this._valuesMap.set(replicaId, newValue);
  }

  get(): number {
    let value = 0;
    this._valuesMap.forEach((val) => {
      value += val;
    });

    return value;
  }

  private mergeMaps(
    thisMap: Map<string, number>,
    otherMap: Map<string, number>,
  ): Map<string, number> {
    const mergedMap = new Map<string, number>(thisMap);

    for (const [key, value] of otherMap.entries()) {
      if (mergedMap.has(key)) {
        const maxValue = Math.max(value, mergedMap.get(key) || 0);
        mergedMap.set(key, maxValue);
      } else {
        mergedMap.set(key, value);
      }
    }

    return mergedMap;
  }

  merge(other: GCounter): void {
    const mergedMap: Map<string, number> = this.mergeMaps(
      this._valuesMap,
      other._valuesMap,
    );
    this._valuesMap = mergedMap;
  }
}
