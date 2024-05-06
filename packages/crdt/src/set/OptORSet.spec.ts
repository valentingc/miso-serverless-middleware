import { OptORSet } from './OptORSet';

describe('OptORSet', () => {
  const replicaAId = 'replicaA';
  const replicaBId = 'replicaB';
  const replicaCId = 'replicaC';
  it('should add correctly', () => {
    const set1: OptORSet<string> = new OptORSet('statefulObject1', '1');
    set1.add('Banana', replicaAId);
    set1.add('Orange', replicaAId);

    expect(set1.get()).toEqual(new Set(['Banana', 'Orange']));
  });

  it('should fail when adding objects without an ID', () => {
    const set1: OptORSet<object> = new OptORSet('statefulObject1', '1');
    expect(() => set1.add({ test: 'test' }, replicaAId)).toThrowError(
      'If value of ORSet is an object, object needs to have an ID.',
    );
  });

  it('should add objects correctly', () => {
    const set1: OptORSet<object> = new OptORSet('statefulObject1', '1');
    set1.add({ id: '123', anotherTest: 'test' }, replicaAId);
    set1.add({ id: '124', test: 'test' }, replicaAId);
    expect(set1.get()).toEqual(
      new Set([
        { id: '123', anotherTest: 'test' },
        { id: '124', test: 'test' },
      ]),
    );
  });

  it('should add objects correctly without duplicates', () => {
    const set1: OptORSet<object> = new OptORSet('statefulObject1', '1');
    set1.add({ id: '123', anotherTest: 'test' }, replicaAId);
    set1.add({ id: '123', anotherTest: 'test' }, replicaAId);
    set1.add({ id: '123', anotherTest: 'test' }, replicaBId);
    expect(set1.get()).toEqual(new Set([{ id: '123', anotherTest: 'test' }]));
  });

  it('should remove objects correctly', () => {
    const set1: OptORSet<object> = new OptORSet('statefulObject1', '1');
    set1.add({ id: '123', anotherTest: 'test' }, replicaAId);
    set1.add({ id: '124', test: 'test' }, replicaAId);
    expect(() => set1.remove({ test: 'test' })).toThrowError(
      'Need to have the id property set to delete objects',
    );

    set1.remove({ id: '124', test: 'test' });
    expect(set1.get()).toEqual(new Set([{ id: '123', anotherTest: 'test' }]));
    // removing again should not do anything
    set1.remove({ id: '124', test: 'test' });
    expect(set1.get()).toEqual(new Set([{ id: '123', anotherTest: 'test' }]));
  });

  it('should remove non-objects correctly', () => {
    const set1: OptORSet<string> = new OptORSet('statefulObject1', '1');
    set1.add('Banana', replicaAId);
    set1.add('Orange', replicaAId);
    set1.remove('Banana');
    expect(set1.get()).toEqual(new Set(['Orange']));
    set1.remove('Orange');
    expect(set1.get()).toEqual(new Set([]));
  });

  it('merge: should stay the same when calling multiple times', () => {
    const setA: OptORSet<string> = new OptORSet('statefulObject1', '1');
    const setB: OptORSet<string> = new OptORSet('statefulObject1', '1');

    setA.add('Banana', replicaAId);
    setA.add('Orange', replicaAId);
    setA.add('Apple', replicaAId);
    expect(setA.get()).toEqual(new Set(['Banana', 'Apple', 'Orange']));

    setB.merge(setA);
    expect(setB.get()).toEqual(new Set(['Banana', 'Apple', 'Orange']));
    setB.merge(setA);
    // should not change
    expect(setB.get()).toEqual(new Set(['Banana', 'Apple', 'Orange']));

    setA.merge(setB);
    expect(setA.get()).toEqual(new Set(['Banana', 'Apple', 'Orange']));
  });

  it('merge: should be possible to re-add element', () => {
    const setA: OptORSet<string> = new OptORSet('statefulObject1', '1');
    const setB: OptORSet<string> = new OptORSet('statefulObject1', '1');

    setA.add('Banana', replicaAId);
    setA.add('Orange', replicaAId);
    setA.add('Apple', replicaAId);

    // re-adding an element should be possible
    setA.add('Alpha', replicaAId);
    setA.add('Beta', replicaAId);
    setA.add('Charlie', replicaAId);
    setA.remove('Alpha');
    setA.add('Alpha', replicaAId);
    setB.merge(setA);
    expect(setA.get()).toEqual(
      new Set(['Banana', 'Apple', 'Orange', 'Alpha', 'Beta', 'Charlie']),
    );
    expect(setB.get()).toEqual(
      new Set(['Banana', 'Apple', 'Orange', 'Alpha', 'Beta', 'Charlie']),
    );
  });

  it('merge: should merge correctly with deletes', () => {
    const setA: OptORSet<string> = new OptORSet('statefulObject1', '1');
    const setB: OptORSet<string> = new OptORSet('statefulObject1', '1');

    setA.add('Banana', replicaAId);
    setA.add('Orange', replicaAId);
    setA.add('Apple', replicaAId); //setA version: 3
    setB.merge(setA);
    expect(setA.get()).toEqual(new Set(['Banana', 'Apple', 'Orange']));
    expect(setB.get()).toEqual(new Set(['Banana', 'Apple', 'Orange']));
    // check if element is deleted
    setA.remove('Orange'); //element version: 2, replicaA Version: 3 -> delete
    setB.merge(setA);
    expect(setB.get()).toEqual(new Set(['Banana', 'Apple']));

    // Test add-wins
    setA.add('Cherry', replicaAId); //replicaA version: 4, replicaB version: -1
    setA.remove('Cherry');
    setB.add('Cherry', replicaBId); // replicaA version: 3, replicaB version: 1
    expect(setA.get()).toEqual(new Set(['Banana', 'Apple']));
    expect(setB.get()).toEqual(new Set(['Banana', 'Apple', 'Cherry']));

    // Cherry should stay since the addition of B is later than the deletion of A
    setB.merge(setA);
    expect(setB.get()).toEqual(new Set(['Banana', 'Apple', 'Cherry']));
    setA.merge(setB);
    expect(setA.get()).toEqual(new Set(['Banana', 'Apple', 'Cherry']));
  });

});
