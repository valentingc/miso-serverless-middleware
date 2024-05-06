import { GCounter } from '../counter/GCounter';
import { ORMap } from './ORMap';

describe('ORMap', () => {
  const replicaAId = 'replicaA';
  const replicaBId = 'replicaB';
  const replicaCId = 'replicaC';

  const getMapAndCounter = (
    counterName: string,
    crdtName: string,
    statefulObjectName = 'statefulObjectA',
  ) => {
    const gCounter = new GCounter(statefulObjectName, crdtName);
    const map: ORMap<string, GCounter> = new ORMap(
      statefulObjectName,
      crdtName,
    );
    return { map, gCounter: gCounter };
  };
  it('set: should add correctly for default case', () => {
    const gCounterA = new GCounter('statefulObject1', '1');
    gCounterA.add(replicaAId, 1);
    const map1: ORMap<string, GCounter> = new ORMap('statefulObject1', '1');
    map1.set('counter1', gCounterA, replicaAId);

    expect(map1.has('counter1')).toBeTruthy();

    const retrieved = map1.get('counter1');
    expect(retrieved).toBeDefined();
    expect(retrieved).toEqual(gCounterA);
    expect(retrieved?.get()).toEqual(1);
  });

  it('delete: should delete correctly', () => {
    const gCounterA = new GCounter('statefulObject1', '1');
    gCounterA.add(replicaAId, 1);
    const map1: ORMap<string, GCounter> = new ORMap('statefulObject1', '1');

    map1.set('counter1', gCounterA, replicaAId);
    expect(map1.size).toEqual(1);
    expect(map1.has('counter1')).toBeTruthy();

    map1.delete('counter1');
    expect(map1.has('counter1')).toBeFalsy();
    expect(map1.size).toEqual(0);
  });

  it('set: should avoid duplicates when adding', () => {
    const gCounterA = new GCounter('statefulObject1', '1');
    gCounterA.add(replicaAId, 1);
    const map1: ORMap<string, GCounter> = new ORMap('statefulObject1', '1');

    map1.set('counter1', gCounterA, replicaAId);
    map1.set('counter1', gCounterA, replicaAId);
    expect(map1.has('counter1')).toBeTruthy();

    const retrieved = map1.get('counter1');
    expect(retrieved).toBeDefined();
    expect(retrieved).toEqual(gCounterA);
    expect(retrieved?.get()).toEqual(1);
  });

  it('clear: should clear correctly', () => {
    const gCounterA = new GCounter('statefulObject1', '1');
    gCounterA.add(replicaAId, 1);
    const map1: ORMap<string, GCounter> = new ORMap('statefulObject1', '1');

    map1.set('counter1', gCounterA, replicaAId);
    map1.set('counter1', gCounterA, replicaAId);
    expect(map1.has('counter1')).toBeTruthy();
    expect(map1.size).toEqual(1);
    map1.clear();

    expect(map1.has('counter1')).toBeFalsy();
    expect(map1.size).toEqual(0);
  });

  it('merge: should work for unequal keys', () => {
    const { map: mapA, gCounter: gCounterA } = getMapAndCounter(
      'counterA',
      'A',
    );
    gCounterA.add(replicaAId, 1);
    mapA.set('counterA', gCounterA, replicaAId);

    const gCounterB = new GCounter('statefulObject1', '1');
    gCounterB.add(replicaBId, 1);
    const mapB: ORMap<string, GCounter> = new ORMap('statefulObjectA', 'b');
    mapB.set('counterB', gCounterB, replicaBId);

    expect(mapA.has('counterA')).toBeTruthy();
    expect(mapA.has('counterB')).toBeFalsy();
    expect(mapB.has('counterB')).toBeTruthy();
    expect(mapB.has('counterA')).toBeFalsy();

    mapA.merge(mapB);
    expect(mapA.has('counterB')).toBeTruthy();
    expect(mapA.has('counterA')).toBeTruthy();

    mapB.merge(mapA);
    expect(mapB.has('counterB')).toBeTruthy();
    expect(mapB.has('counterA')).toBeTruthy();
  });

  it('merge: should work for equal keys', () => {
    const { map: mapA, gCounter: gCounterA } = getMapAndCounter(
      'counterA',
      'A',
    );
    gCounterA.add(replicaAId, 1);
    mapA.set('counterA', gCounterA, replicaAId);

    const { map: mapB, gCounter: gCounterB } = getMapAndCounter(
      'counterB',
      'B',
    );
    gCounterB.add(replicaBId, 3);
    mapB.set('counterA', gCounterB, replicaBId);

    let counter = mapA.get('counterA');
    expect(counter?.get()).toEqual(1);

    counter = mapB.get('counterA');
    expect(counter?.get()).toEqual(3);
    mapA.merge(mapB);
    counter = mapA.get('counterA');
    expect(counter?.get()).toEqual(4);

    mapB.merge(mapA);
    counter = mapB.get('counterA');
    expect(counter?.get()).toEqual(4);
  });

  it('values: should return all values', () => {
    const { map: mapA, gCounter: gCounterA } = getMapAndCounter(
      'counterA',
      'A',
    );
    mapA.set('counterA', gCounterA, replicaAId);

    const values = mapA.values();
    expect(values.next().value).toEqual(gCounterA);
  });

  it('entries: should return key-value pairs', () => {
    const { map: mapA, gCounter: gCounterA } = getMapAndCounter(
      'counterA',
      'A',
    );
    mapA.set('counterA', gCounterA, replicaAId);

    const entries = mapA.entries();
    expect(entries.next().value).toEqual(['counterA', gCounterA]);
  });

  it('keys: should return all keys', () => {
    const { map: mapA, gCounter: gCounterA } = getMapAndCounter(
      'counterA',
      'A',
    );
    mapA.set('counterA', gCounterA, replicaAId);

    const keys = mapA.keys();
    expect(keys.next().value).toEqual('counterA');
  });


  it('keys: should return undefined if there are no keys', () => {
    const { map } = getMapAndCounter('counterA', 'A');
    const keys = map.keys();
    expect(keys.next().value).toBeUndefined();
  });
  
  it('forEach: should iterate over all values', () => {
    const { map: mapA, gCounter: gCounterA } = getMapAndCounter(
      'counterA',
      'A',
    );
    mapA.set('counterA', gCounterA, replicaAId);

    mapA.forEach((value, key) => {
      expect(key).toEqual('counterA');
      expect(value).toEqual(gCounterA);
    });
  });
});
