'use strict';
import { StatefulObjectProxy } from '@miso/sdk';
import * as winston from 'winston';
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(
      (info) =>
        `${info.timestamp} [FN] [${info.level}]: ${info.message}` +
        (info.splat !== undefined ? `${info.splat}` : ' '),
    ),
  ),
  defaultMeta: { service: 'fn-set' },
  transports: [new winston.transports.Console()],
});

/**
 * Main entry point of the function.
 * Depending on the "operation" key in the body, a different method will be called
 */
module.exports = async (event: any, context: any) => {
  const startTimestamp = process.hrtime.bigint();
  const statefulObject: StatefulObjectProxy = context.statefulObject;
  const body = event.body;

  const operation = body.operation;

  if (operation === undefined) {
    throw new Error('Operation is undefined');
  }
  if (body.values === undefined) {
    throw new Error('values is undefined');
  }

  if (body.crdtName === undefined) {
    throw new Error('crdtName is undefined');
  }
  context.headers({
    'Content-Type': 'application/json',
  });

  try {
    switch (operation) {
      case 'allreduce-miso':
        return performAllReduceMiso(body, statefulObject, startTimestamp);
      case 'result-miso':
        return await getResult(body, statefulObject, startTimestamp);
      default:
        throw Error('Unknown operation');
    }
  } catch (error) {
    console.log('Error while executing function', error);
    throw error;
  }
};

async function getResult(
  body: any,
  statefulObject: StatefulObjectProxy,
  startTimeStamp: bigint,
) {
  const counter = statefulObject.getPNCounter(body.crdtName);
  const result = await counter.getValue();
  const endTime = process.hrtime.bigint();
  return {
    totalSum: result,
    times: {
      start: String(startTimeStamp),
      end: String(endTime),
      durationExecution: Number(endTime - startTimeStamp) / 1e6,
    },
  };
}

async function performAllReduceMiso(
  body: any,
  statefulObject: StatefulObjectProxy,
  startTimeStamp: bigint,
) {
  const counter = statefulObject.getPNCounter(body.crdtName);

  try {
    const values = body.values;
    const sum = values.reduce((a: number, b: number) => a + b, 0);

    counter.add(sum);

    const endTime = process.hrtime.bigint();
    return {
      partialSum: sum,
      times: {
        start: String(startTimeStamp),
        end: String(endTime),
        durationExecution: Number(endTime - startTimeStamp) / 1e6,
      },
    };
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
}
