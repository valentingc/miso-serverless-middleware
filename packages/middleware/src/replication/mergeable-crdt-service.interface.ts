import { StatefulObject } from '../objects/stateful-object.js';

export interface MergeableCrdtService {
  merge(request: any, statefulObject: StatefulObject): any;
}
