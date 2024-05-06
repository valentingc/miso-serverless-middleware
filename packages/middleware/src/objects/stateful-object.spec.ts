import { GCounter } from '@miso/crdt';
import { StatefulObject } from './stateful-object.js';

describe('StatefulObject', () => {
  let so: StatefulObject;
  const id = 'anyId';
  const serverlessFunctionName = 'anyFunction';
  beforeEach(() => {
    so = new StatefulObject(id, serverlessFunctionName);
  });

  it('should set ID and serverless function name', () => {
    expect(so.id).toEqual(id);
    expect(so.serverlessFunctionName).toEqual(serverlessFunctionName);
  });

  it('should set CRDT correctly', () => {
    const crdt: GCounter = new GCounter(id, 'gCounter1');
    expect(so.hasCrdt(crdt.crdtName)).toBeFalsy();

    so.addCrdt(crdt.crdtName, crdt);
    expect(so.hasCrdt(crdt.crdtName)).toBeTruthy();

    expect(so.getCrdt(crdt.crdtName)).toEqual(crdt);
  });

  it('should throw error for non-existent crdt', () => {
    const crdt: GCounter = new GCounter(id, 'gCounter1');
    expect(() => so.getCrdt(crdt.crdtName)).toThrow();
  });
});
