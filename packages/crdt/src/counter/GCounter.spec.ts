import { GCounter } from './GCounter';

describe('GCounter', () => {
  it('should set values from constructor when supplied', () => {
    const map: Map<string, number> = new Map();
    map.set('replica1', 100);
    const counter1: GCounter = new GCounter('statefulObject1', '1', map);
    expect(counter1.get()).toEqual(100);
  });
  it('should add correctly', () => {
    const counter1: GCounter = new GCounter('statefulObject1', '1');
    counter1.add('replica1', 1);
    counter1.add('replica2', 1);

    const value = counter1.get();
    expect(value).toEqual(2);
  });
  it('should merge maps correctly', () => {
    const counter1: GCounter = new GCounter('statefulObject1', '1');
    const counter2: GCounter = new GCounter('statefulObject2', '2');
    counter1.add('replica1', 1);
    counter1.add('replica2', 3);
    counter2.add('replica1', 2);
    counter2.add('replica2', 1);

    counter1.merge(counter2);
    counter2.merge(counter1);
    // The first map contains the following tuples: <"1", 1>, <"2", 3>
    // the second map contains the following tuples: <"1", 2>, <"2", 1>
    // new map: <"1", 2>, <"2", 3> -> sum = 5

    expect(counter1.get()).toEqual(5);
    expect(counter2.get()).toEqual(5);
  });
  it('should not be able to add zero or negative numbers', () => {
    const counter1: GCounter = new GCounter('statefulObject1', '1');
    expect(() => counter1.add('replica1', -1)).toThrow();
    expect(() => counter1.add('replica1', 0)).toThrow();
  });

  it('should retrieve data from abstract superclass correctly', () => {
    const counter1: GCounter = new GCounter('statefulObject1', '1');
    expect(counter1.crdtName).toEqual('1');
    expect(counter1.statefulObjectId).toEqual('statefulObject1');
  });
  it('should work correctly if not all replicas know about all other replicas', () => {
    const counter1: GCounter = new GCounter('statefulObject1', '1');
    const counter2: GCounter = new GCounter('statefulObject2', '2');
    counter1.add('replica1', 1);
    counter1.add('replica2', 3);
    counter2.add('replica1', 2);
    counter2.add('replica3', 2);
    counter2.add('replica4', 1);
    counter1.merge(counter2);
    expect(counter1.get()).toEqual(8);
    counter2.merge(counter1);
    expect(counter2.get()).toEqual(8);
  });
});
