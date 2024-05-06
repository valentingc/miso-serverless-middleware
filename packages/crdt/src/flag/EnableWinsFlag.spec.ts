import { VectorClock } from '../common/VectorClock';
import { EnableWinsFlag } from './EnableWinsFlag';

describe('EnableWinsFlag', () => {
  // it('should assign correctly', () => {
  //   const set1: EnableWinsFlag = new EnableWinsFlag(
  //     'statefulObject1',
  //     '1',
  //     'replica1',
  //   );
  //   set1.assign(true);

  //   expect(set1.get()).toEqual(true);

  //   set1.assign(false);
  //   expect(set1.get()).toEqual(false);
  // });

  it('should merge correctly when replicating', () => {
    const otherMap = new Map<string, number>();
    otherMap.set('set-546db65d7-cf6b2', 2);
    const otherReplicaId = 'set-546db65d7-cf6b2';

    const thisReplicaId = 'set-546db65d7-ljjkt';
    const thisMap = new Map<string, number>();

    const otherFlag = new EnableWinsFlag(
      'statefulObject1',
      '1',
      false,
      new VectorClock(otherMap),
    );
    const thisFlag = new EnableWinsFlag(
      'statefulObject1',
      '1',
      true,
      new VectorClock(thisMap),
    );

    thisFlag.merge(otherFlag);
    expect(thisFlag.get()).toBe(false);
  });
  it('should merge correctly', () => {
    const otherReplicaId = 'set-546db65d7-cf6b2';
    const thisReplicaId = 'set-546db65d7-ljjkt';

    const otherFlag = new EnableWinsFlag('statefulObject1', '1');
    const thisFlag = new EnableWinsFlag('statefulObject1', '2');
    thisFlag.assign(true, thisReplicaId);
    otherFlag.merge(thisFlag);
    expect(otherFlag.get()).toBe(true);
    expect(thisFlag.get()).toBe(true);

    thisFlag.assign(false, thisReplicaId);
    otherFlag.merge(thisFlag);
    expect(otherFlag.get()).toBe(false);
    thisFlag.merge(otherFlag);
    otherFlag.merge(thisFlag);
    expect(thisFlag.get()).toBe(false);

    otherFlag.assign(true, otherReplicaId);
    thisFlag.merge(otherFlag);
    expect(thisFlag.get()).toBe(true);
    expect(otherFlag.get()).toBe(true);

    thisFlag.assign(true, thisReplicaId);
    otherFlag.merge(thisFlag);
    expect(otherFlag.get()).toBe(true);
    expect(thisFlag.get()).toBe(true);
    thisFlag.merge(otherFlag);
    expect(thisFlag.get()).toBe(true);
  });
  it('should merge correctly', () => {
    const setAReplicaId = 'replicaA';
    const setBReplicaId = 'replicaB';
    const setCReplicaId = 'replicaC';
    const setA: EnableWinsFlag = new EnableWinsFlag('statefulObject1', '1');
    const setB: EnableWinsFlag = new EnableWinsFlag('statefulObject1', '1');
    const setC: EnableWinsFlag = new EnableWinsFlag('statefulObject1', '1');

    setA.assign(true, setAReplicaId);
    expect(setA.get()).toEqual(true);

    setB.merge(setA);
    expect(setA.get()).toEqual(true);
    expect(setB.get()).toEqual(true);

    setA.assign(false, setAReplicaId);
    setB.assign(true, setBReplicaId);
    expect(setA.get()).toEqual(false);
    expect(setB.get()).toEqual(true);
    setB.merge(setA);
    expect(setB.get()).toEqual(true);

    setA.merge(setB);
    setA.merge(setB);
    expect(setA.get()).toEqual(true);

    setA.assign(false, setAReplicaId);
    setB.merge(setA);
    expect(setB.get()).toEqual(false);
    setA.merge(setB);
    expect(setA.get()).toEqual(false);
    setA.merge(setA);
    expect(setB.get()).toEqual(false);

    setC.merge(setA);
    expect(setC.get()).toEqual(false);

    setA.merge(setC);
    setA.assign(true, setAReplicaId);
    setA.assign(false, setAReplicaId);
    setC.assign(true, setCReplicaId);
    setA.merge(setC);
    expect(setA.get()).toEqual(true);
  });
});
