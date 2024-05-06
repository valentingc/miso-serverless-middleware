'use strict';
import { randomUUID } from 'crypto';
import { hostname } from 'os';
import { createClient, RedisClientType } from 'redis';
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
    let redisClient: RedisClientType<any, any, any> | undefined;
    if (body.operation && String(body.operation).includes('redis')) {
      redisClient = createClient({
        url: body.redisUrl,
      });
      redisClient.on('end', () => {
        console.log('Redis connection ended');
      });

      redisClient.on('error', (err) => {
        console.log('Redis Client Error', err);
        createClient({
          url: body.redisUrl,
        });
      });

      await redisClient.connect();
    }

    switch (operation) {
      case 'allreduce-redis':
        return performAllReduceRedis(body, redisClient, startTimestamp);
      case 'result-redis':
        return await getResultRedis(body, redisClient,startTimestamp);
      default:
        throw Error('Unknown operation');
    }
  } catch (error) {
    console.log('Error while executing function', error);
    return {
      totalSum: -1,
    };
  }
};

async function performAllReduceRedis(
  body: any,
  redisClient: RedisClientType<any, any, any> | undefined,
  startTimeStamp: bigint,
) {
  if (body.reset && body.reset === true) {
  }
  if (redisClient === undefined) {
    throw new Error('Redis client is undefined');
  }

  const values = body.values;
  const sum = values.reduce((a: number, b: number) => a + b, 0);

  // redisClient.sAdd('all_pods', hostname());

  const key = hostname() + randomUUID();
  const res = await redisClient.hSet('allreduce' + body.crdtName, key, sum);
  redisClient.quit();
  const endTime = process.hrtime.bigint();
  return {
    totalSum: sum,
    times: {
      start: String(startTimeStamp),
      end: String(endTime),
      durationExecution: Number(endTime - startTimeStamp) / 1e6,
    },
  };
}

async function getResultRedis(
  body: any,
  redisClient: RedisClientType<any, any, any> | undefined,
  startTimeStamp: bigint,
) {
  if (redisClient === undefined) {
    throw new Error('Redis client is undefined');
  }
  const values = await redisClient.hVals('allreduce' + body.crdtName);
  // console.log('Values: ' + JSON.stringify(values));
  const fnResults: number[] = values.map(Number);
  // console.log('Values as numbers: ' + JSON.stringify(fnResults));
  const sum = fnResults.reduce((a: number, b: number) => a + b, 0);
  // console.log('Sum is ' + sum);
  await redisClient.quit();
  const endTime = process.hrtime.bigint();
  return {
    totalSum: sum,
    times: {
      start: String(startTimeStamp),
      end: String(endTime),
      durationExecution: Number(endTime - startTimeStamp) / 1e6,
    },
  };
}
