import { MVRegister } from './MVRegister';

describe('MVRegister', () => {
  const replicaAId = 'replicaA';
  const replicaBId = 'replicaB';
  const replicaCId = 'replicaC';
  it('should assign correctly', () => {
    const set1: MVRegister<string> = new MVRegister('statefulObject1', '1');
    set1.assign('Banana', replicaAId);

    expect(set1.get()).toEqual(new Set(['Banana']));

    set1.assign('Orange', replicaAId);
    expect(set1.get()).toEqual(new Set(['Orange']));
  });

  it('should merge correctly', () => {
    const setA: MVRegister<string> = new MVRegister('statefulObject1', '1');
    const setB: MVRegister<string> = new MVRegister('statefulObject1', '1');
    const setC: MVRegister<string> = new MVRegister('statefulObject1', '1');

    setA.assign('1', replicaAId);
    expect(setA.get()).toEqual(new Set(['1']));

    setB.merge(setA);
    expect(setA.get()).toEqual(new Set(['1']));
    expect(setB.get()).toEqual(new Set(['1']));

    setA.assign('2', replicaAId);
    setB.assign('3', replicaBId);
    expect(setA.get()).toEqual(new Set(['2']));
    expect(setB.get()).toEqual(new Set(['3']));
    setB.merge(setA);
    expect(setB.get()).toEqual(new Set(['2', '3']));

    setA.merge(setB);
    setA.merge(setB);

    setA.assign('4', replicaAId);
    setB.merge(setA);
    expect(setB.get()).toEqual(new Set(['4']));
    setA.merge(setB);
    expect(setA.get()).toEqual(new Set(['4']));
    setA.merge(setA);
    expect(setB.get()).toEqual(new Set(['4']));

    setC.merge(setA);
    expect(setC.get()).toEqual(new Set(['4']));

    setC.assign('5', replicaCId);
    setB.assign('6', replicaBId);
    setA.assign('7', replicaAId);

    setA.merge(setC);
    setA.merge(setB);
    expect(setA.get()).toEqual(new Set(['5', '6', '7']));
    setA.merge(setC);
    setA.merge(setB);
    expect(setA.get()).toEqual(new Set(['5', '6', '7']));

    setB.merge(setA);
    setB.merge(setC);

    setC.merge(setA);
    setC.merge(setB);

    expect(setA.get()).toEqual(new Set(['5', '6', '7']));
    expect(setB.get()).toEqual(new Set(['5', '6', '7']));
    expect(setC.get()).toEqual(new Set(['5', '6', '7']));

    setA.assign('8', replicaAId);
    setB.merge(setA);
    setC.merge(setA);

    expect(setA.get()).toEqual(new Set(['8']));
    expect(setB.get()).toEqual(new Set(['8']));
    expect(setC.get()).toEqual(new Set(['8']));
  });
});
