import { GCounter } from '@miso/crdt';
import { deserialize, serialize } from 'v8';
const crdt: GCounter = new GCounter('asdf', 'asdf');
crdt.add('replica1', 1);

const serialized = serialize(crdt);

const deserialized = deserialize(serialized);
deserialized.__proto__ = GCounter.prototype;
crdt.add('replica2', 1);
const value = crdt.get();


const set = new Set<GCounter>();
set.add(crdt);

const ser2 = serialize(set);
const des2 = deserialize(ser2);

des2.__proto__ = Set.prototype;
const type = 'GCounter';
let prototype;
if (type === 'GCounter') {
  prototype = GCounter.prototype;
}
const tmp = des2 as Set<typeof prototype>;
tmp.add(crdt);
console.log('done');
