'use strict';
import { randomUUID } from 'crypto';
import { hostname } from 'os';
import { createClient, RedisClientType } from 'redis';

module.exports = async (event: any, context: any) => {
  const body = event.body;
  const operation = body.operation;
  context.headers({
    'Content-Type': 'application/json',
  });
  try {
    const redisClient: RedisClientType = createClient({
      url: body.redisUrl,
    });
    redisClient.on('error', (err) => {
      console.error('Redis Client Error', err);
    });
    await redisClient.connect();
    switch (operation) {
      case 'allreduce-redis':
        return performAllReduceRedis(body, redisClient);
      case 'result-redis':
        return await getResultRedis(body, redisClient);
      default:
        throw Error('Unknown operation');
    }
  } catch (error) {
    console.error('Error while executing function', error);
  }
};
async function performAllReduceRedis(body: any, redisClient: RedisClientType) {
  const sum = body.values.reduce((a: number, b: number) => a + b, 0);
  const key = hostname() + randomUUID();
  await redisClient.hSet('allreduce' + body.crdtName, key, sum);
  redisClient.quit();
  return {
    partialSum: sum,
  };
}
async function getResultRedis(
  body: any,
  redisClient: RedisClientType<any, any, any>,
) {
  const values = await redisClient.hVals('allreduce' + body.crdtName);
  const fnResults: number[] = values.map(Number);
  const sum = fnResults.reduce((a: number, b: number) => a + b, 0);
  await redisClient.quit();
  return {
    totalSum: sum,
  };
}
3;