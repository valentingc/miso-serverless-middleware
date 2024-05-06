import { GSet } from './GSet';

describe('GSet', () => {
  it('should add correctly', () => {
    const set1: GSet<string> = new GSet('statefulObject1', '1');
    set1.add('hello');
    set1.add('hello2');

    const values = set1.get();
    expect([...values.values()]).toEqual(['hello', 'hello2']);
  });

  it('should merge correctly', () => {
    const set1: GSet<string> = new GSet('statefulObject1', '1');
    set1.add('hello');
    set1.add('hello2');

    const set2: GSet<string> = new GSet('statefulObject1', '2');
    set1.add('hello');
    set1.merge(set2);
    expect([...set1.get().values()]).toEqual(['hello', 'hello2']);
    set1.add('hello2');
    expect([...set1.get().values()]).toEqual(['hello', 'hello2']);

    set1.add('hello3');
    expect([...set1.get().values()]).toEqual(['hello', 'hello2', 'hello3']);
  });
});
