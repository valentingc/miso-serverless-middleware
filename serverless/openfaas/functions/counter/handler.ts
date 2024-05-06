'use strict';
import { StatefulObjectProxy } from '@miso/sdk';

async function getPNCounterResponseEvaluation(
  body: any,
  statefulObject: StatefulObjectProxy,
  operation: string,
) {
  const counter = statefulObject.getPNCounter(body.crdtName);
  let res;
  if (operation === 'increase') {
    res = await counter.add(body.value);
  } else if (operation === 'decrease') {
    res = await counter.subtract(body.value);
  } else if (operation === 'getValue') {
    res = await counter.getValue();
  }

  let finalResult: any = { acknowledged: true };
  if (body.includeValueInResponse === true && res !== undefined) {
    finalResult = {
      ...finalResult,
      currentValue: res.value,
    };
  }
  return finalResult;
}
async function getGCounterResponse(
  body: any,
  statefulObject: StatefulObjectProxy,
) {
  const counter = statefulObject.getGCounter('gcounter1');

  try {
    const now = Date.now();
    let result = await counter.add(body.value);
    console.log(
      `GCounter Add Request finished... ${
        Date.now() - now
      }ms, Response: ${JSON.stringify(result)}`,
    );

    result = await counter.getValue();
    console.log(
      `GCounter GetValue finished... ${
        Date.now() - now
      }ms, Response: ${JSON.stringify(result)}`,
    );
    return result;
  } catch (error) {
    console.error(error);
  }
}
async function getPNCounterResponse(
  body: any,
  statefulObject: StatefulObjectProxy,
) {
  const counter = statefulObject.getPNCounter('pnCounter1');

  try {
    const now = Date.now();
    let result = await counter.add(body.value + 1);
    console.log(
      `PNCounter Add Request finished... ${
        Date.now() - now
      }ms, Response: ${JSON.stringify(result)}`,
    );

    result = await counter.getValue();
    console.log(
      `PNCounter GetValue finished... ${
        Date.now() - now
      }ms, Response: ${JSON.stringify(result)}`,
    );

    result = await counter.subtract(body.value);
    console.log(
      `PNCounter Subtract finished... ${
        Date.now() - now
      }ms, Response: ${JSON.stringify(result)}`,
    );
    return result;
  } catch (error) {
    console.error(error);
  }
}
module.exports = async (event: any, context: any) => {
  console.log('COUNTER');
  const statefulObject = context.statefulObject;
  const body = event.body;

  const operation = body.operation;

  if (operation === undefined) {
    throw new Error('Operation is undefined');
  }
  if (body.value === undefined) {
    throw new Error('Value is undefined');
  }

  let res;
  switch (operation) {
    case 'gcounter':
      res = getGCounterResponse(body, statefulObject);
      break;
    case 'pncounter':
      res = getPNCounterResponse(body, statefulObject);
      break;
    case 'pncounter-increase':
      res = getPNCounterResponseEvaluation(body, statefulObject, 'increase');
      break;
    case 'pncounter-decrease':
      res = getPNCounterResponseEvaluation(body, statefulObject, 'decrease');
      break;
    case 'pncounter-getValue':
      res = getPNCounterResponseEvaluation(body, statefulObject, 'getValue');
      break;
    default:
      throw Error('Unknown operation');
  }
  context.headers({
    'Content-Type': 'application/json',
  });
  return {
    data: await res,
  };
};
