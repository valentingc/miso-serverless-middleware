'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const os_1 = require("os");
const redis_1 = require("redis");
module.exports = async (event, context) => {
    const body = event.body;
    const operation = body.operation;
    context.headers({
        'Content-Type': 'application/json',
    });
    try {
        const redisClient = (0, redis_1.createClient)({
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
    }
    catch (error) {
        console.error('Error while executing function', error);
    }
};
async function performAllReduceRedis(body, redisClient) {
    const sum = body.values.reduce((a, b) => a + b, 0);
    const key = (0, os_1.hostname)() + (0, crypto_1.randomUUID)();
    await redisClient.hSet('allreduce' + body.crdtName, key, sum);
    redisClient.quit();
    return {
        partialSum: sum,
    };
}
async function getResultRedis(body, redisClient) {
    const values = await redisClient.hVals('allreduce' + body.crdtName);
    const fnResults = values.map(Number);
    const sum = fnResults.reduce((a, b) => a + b, 0);
    await redisClient.quit();
    return {
        totalSum: sum,
    };
}
