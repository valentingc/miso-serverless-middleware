import { count } from 'console';
import { GCounter } from './GCounter';
import { PNCounter } from './PNCounter';

describe('PNCounter', () => {
  it('should add correctly', () => {
    const counter1: PNCounter = new PNCounter('statefulObject1', '1');
    counter1.add('replica1', 1);
    counter1.add('replica2', 3);

    expect(counter1.get()).toEqual(4);
  });
  it('should subtract correctly', () => {
    const counter1: PNCounter = new PNCounter('statefulObject1', '1');
    counter1.add('replica1', 1);
    expect(counter1.get()).toEqual(1);
    counter1.add('replica2', 3);
    expect(counter1.get()).toEqual(4);
    counter1.subtract('replica1', 1);
    expect(counter1.get()).toEqual(3);
    counter1.subtract('replica2', 3);

    expect(counter1.get()).toEqual(0);
  });

  it('should merge correctly', () => {
    const counter1: PNCounter = new PNCounter(
      'statefulObject1',
      'countVisitors',
    );
    counter1.add('replica1', 1);
    counter1.add('replica2', 4);
    counter1.subtract('replica1', 1);
    counter1.subtract('replica2', 2);

    const counter2: PNCounter = new PNCounter(
      'statefulObject1',
      'countVisitors',
    );
    counter2.add('replica1', 1);
    counter2.add('replica2', 5);
    counter2.subtract('replica1', 1);
    counter2.subtract('replica2', 2);

    counter1.merge(counter2);
    counter2.merge(counter1);
    expect(counter1.get()).toEqual(3);
    expect(counter2.get()).toEqual(3);
  });
});
