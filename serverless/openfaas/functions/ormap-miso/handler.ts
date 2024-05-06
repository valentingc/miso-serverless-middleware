'use strict';
import { GCounterProxy, StatefulObjectProxy } from '@miso/sdk';
import { ORMapProxy } from '@miso/sdk/dist/proxies/maps/ORMapProxy.js';
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
  logger.debug(JSON.stringify(event));
  const statefulObject: StatefulObjectProxy = context.statefulObject;

  try {
    const map: ORMapProxy<string, GCounterProxy> = statefulObject.getORMap(
      'testmap',
      {
        key: () => 'test',
        value: GCounterProxy,
      },
    );
    let keys = await map.keys();
    console.log('KEYS? ' + JSON.stringify(keys));
    const counter = statefulObject.getGCounter('testgc1');
    const counter2 = statefulObject.getGCounter('test2gc2');
    await counter.add(1);
    await map.set('testgc1', counter);
    await map.set('testgc2', counter2);
    keys = await map.keys();
    console.log('KEYS? ' + JSON.stringify(keys));
  } catch (error) {
    console.log('Error while executing function', error);
    throw error;
  }
};
