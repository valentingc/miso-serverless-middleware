'use strict';
import { StatefulObjectProxy } from '@miso/sdk';

module.exports = async (event: any, context: any) => {
  const statefulObject: StatefulObjectProxy = context.statefulObject;
  const body = event.body;
  const operation = body.operation;
  context.headers({
    'Content-Type': 'application/json',
  });

  try {
    switch (operation) {
      case 'allreduce-miso':
        return performAllReduceMiso(body, statefulObject);
      case 'result-miso':
        return await getResult(body, statefulObject);
      default:
        throw Error('Unknown operation');
    }
  } catch (error) {
    console.log('Error while executing function', error);
    throw error;
  }
};
async function getResult(body: any, statefulObject: StatefulObjectProxy) {
  const counter = statefulObject.getPNCounter(body.crdtName);
  const result = await counter.getValue();
  return {
    totalSum: result,
  };
}
async function performAllReduceMiso(
  body: any,
  statefulObject: StatefulObjectProxy,
) {
  const counter = statefulObject.getPNCounter(body.crdtName);
  const sum = body.values.reduce((a: number, b: number) => a + b, 0);
  counter.add(sum);
  return {
    partialSum: sum,
  };
}
