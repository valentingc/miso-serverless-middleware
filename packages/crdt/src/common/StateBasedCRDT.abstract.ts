export abstract class StateBasedCRDT {
  constructor(readonly statefulObjectId: string, readonly crdtName: string) {}

  abstract merge(other: StateBasedCRDT): void;
}
