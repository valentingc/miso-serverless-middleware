'use strict';
const winston = require('winston');
const sdk = require('@miso/sdk');
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
module.exports = async (event, context) => {
  logger.debug(JSON.stringify(event));
  const statefulObject = context.statefulObject;
  const body = event.body;

  const operation = body.operation;

  if (operation === undefined) {
    throw new Error('Operation is undefined');
  }
  if (body.value === undefined) {
    throw new Error('Value is undefined');
  }

  if (body.itemCount === undefined) {
    throw new Error('ItemCount is undefined');
  }

  switch (operation) {
    case 'orset':
      return await getORSetResponse(body, statefulObject);
    case 'gset':
      return await getGSetResponse(body, statefulObject);
    default:
      throw Error('Unknown operation');
  }
};

async function getGSetResponse(body, statefulObject) {
  const gsetNumber = statefulObject.getGSet(
    'GSetNumber',
    sdk.SetGenericType.NUMBER,
  );
  const now = Date.now();
  const promises = [];

  for (let i = 0; i < body.itemCount; i++) {
    promises.push(gsetNumber.add(i));
  }
  await Promise.all(promises);
  try {
    const resultGet = await gsetNumber.getValue();
    logger.debug(
      `GetValue request finished... ${
        Date.now() - now
      }ms, Response: ${JSON.stringify(resultGet)}`,
    );

    return resultGet;
  } catch (error) {
    console.error(error);
  }
}

async function setAssignAndGet(set, value) {
  let now = Date.now();
  const resultAdd = await set.add(value);
  logger.debug(
    `Add request finished... ${Date.now() - now}ms, Response: ${JSON.stringify(
      resultAdd,
    )}`,
  );
  now = Date.now();
  const resultGet = await set.getValue();
  logger.debug(
    `GetValue request finished... ${
      Date.now() - now
    }ms, Response: ${JSON.stringify(resultAdd)}`,
  );
  return {
    resultAdd,
    resultGet,
  };
}
async function getORSetResponse(body, statefulObject) {
  const orsetNumber = statefulObject.getORSet(
    'ORSetNumber',
    sdk.SetGenericType.NUMBER,
  );
  const orsetString = statefulObject.getORSet(
    'ORSetString',
    sdk.SetGenericType.STRING,
  );
  const orsetObject = statefulObject.getORSet(
    'ORSetObject',
    sdk.SetGenericType.OBJECT,
  );
  body.value = body.value + '';
  try {
    /**
     * NUMBER
     */
    setAssignAndGet(orsetNumber, 1);
    setAssignAndGet(orsetNumber, 2);

    /** STRING */
    setAssignAndGet(orsetString, '1');
    setAssignAndGet(orsetString, '2');

    /**
     * OBJECT
     */

    setAssignAndGet(orsetObject, { id: '1', test: 'test' });
    setAssignAndGet(orsetObject, { id: '12', anotherTest: 'test' });
    await orsetObject.remove({ id: '1234' });
    await orsetObject.getValue();

    return {};
  } catch (error) {
    console.error(error);
  }
}
