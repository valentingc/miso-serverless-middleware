'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const minio_1 = require("minio");
const promises_1 = require("timers/promises");
const winston = __importStar(require("winston"));
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    format: winston.format.combine(winston.format.colorize(), winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), winston.format.printf((info) => `${info.timestamp} [FN] [${info.level}]: ${info.message}` +
        (info.splat !== undefined ? `${info.splat}` : ' '))),
    defaultMeta: { service: 'fn-set' },
    transports: [new winston.transports.Console()],
});
/**
 * Main entry point of the function.
 * Depending on the "operation" key in the body, a different method will be called
 */
module.exports = async (event, context) => {
    const startTimestamp = process.hrtime.bigint();
    const body = event.body;
    const operation = body.operation;
    if (operation === undefined) {
        throw new Error('Operation is undefined');
    }
    context.headers({
        'Content-Type': 'application/json',
    });
    const minioClient = new minio_1.Client({
        endPoint: 'minio.minio-demo01.svc.cluster.local',
        useSSL: false,
        accessKey: body.minio.accessToken,
        secretKey: body.minio.secretKey,
    });
    try {
        switch (String(operation).toLowerCase()) {
            case 'init-minio':
                console.log('Performing init-minio');
                const exists = await minioClient.bucketExists(body.crdtName);
                if (exists === false) {
                    console.log('Need to create bucket');
                    await minioClient.makeBucket(body.crdtName);
                }
                return {
                    ok: true,
                };
            case 'allreduce-minio':
                console.log('Performing allreduce-minio');
                return performAllReduceMinio(body, minioClient, startTimestamp);
            case 'result-minio':
                console.log('Performing result-minio');
                return await getResultMinio(body, minioClient, startTimestamp);
            case 'cleanup-minio':
                console.log('Performing cleanup-minio');
                return await cleanupMinio(body, minioClient);
            default:
                throw Error('Unknown operation: ' + operation);
        }
    }
    catch (error) {
        console.log('Error while executing function', error);
    }
};
async function getResultMinioAllObjects(body, minioClient, all = false) {
    return new Promise((resolve, reject) => {
        // bug in ts-types
        const stream = minioClient.listObjects(body.crdtName, all === true ? '' : 'result/allreduce/' + body.crdtName, true, { IncludeVersion: true });
        const objects = [];
        stream.on('data', function (obj) {
            // console.log('object: ' + JSON.stringify(obj));
            const objName = obj.name;
            if (objName === undefined) {
                return;
            }
            objects.push(obj);
        });
        stream.on('end', () => {
            resolve(objects);
        });
        stream.on('error', function (err) {
            console.log(err);
        });
    });
}
async function cleanupMinio(body, minioClient) {
    const objects = await getResultMinioAllObjects(body, minioClient, true);
    await minioClient.removeObjects(body.crdtName, objects);
    await (0, promises_1.setTimeout)(2000);
    await minioClient.removeBucket(body.crdtName);
}
async function getResultMinio(body, minioClient, startTimeStamp) {
    const beginRead = Date.now();
    let readTime;
    let totalResult = 0;
    const objects = (await getResultMinioAllObjects(body, minioClient)).map((obj) => obj.name);
    const getObject = (objName) => {
        return new Promise((resolve, reject) => {
            minioClient.getObject(body.crdtName, objName, function (err, stream) {
                if (err) {
                    return console.error('Error retrieving object:', err);
                }
                let objectData = '';
                stream.on('data', (chunk) => {
                    objectData += chunk.toString();
                });
                stream.on('end', () => {
                    const nr = Number(objectData);
                    resolve(nr);
                });
                stream.on('error', (err) => {
                    console.error('Error reading object data:', err);
                    reject(err);
                });
            });
        });
    };
    return new Promise(async (resolve, reject) => {
        await Promise.all(objects.map((objName) => getObject(objName))).then((values) => {
            const endRead = Date.now();
            readTime = endRead - beginRead;
            totalResult += values.reduce((a, b) => a + b, 0);
            const endTime = process.hrtime.bigint();
            // console.log(
            //   "OK - All objects retrieved, let's sum them up: " + totalResult,
            // );
            resolve({
                totalSum: totalResult,
                times: {
                    start: String(startTimeStamp),
                    end: String(endTime),
                    durationExecution: Number(endTime - startTimeStamp) / 1e6,
                },
            });
        });
    });
}
async function putObject(bucketName, objectName, buffer, minioClient) {
    return new Promise((resolve, reject) => {
        minioClient.putObject(bucketName, objectName, buffer, function (err, etag) {
            // console.log('putting object with name: ' + objectName);
            if (err) {
                console.error(err);
                console.log('UPLOAD FAILED - NOT OK');
                reject(err);
            }
            // console.log('ok');
            resolve(true);
        });
    });
}
async function performAllReduceMinio(body, minioClient, startTimeStamp) {
    if (body.reset && body.reset === true) {
    }
    const values = body.values;
    const sum = values.reduce((a, b) => a + b, 0);
    // console.log('Partial sum? ' + sum);
    const buffer = String(sum);
    const objectName = 'result/allreduce/' + body.crdtName + '/' + (0, crypto_1.randomUUID)();
    putObject(body.crdtName, objectName, buffer, minioClient);
    const endTime = process.hrtime.bigint();
    return {
        partialSum: sum,
        times: {
            start: String(startTimeStamp),
            end: String(endTime),
            durationExecution: Number(endTime - startTimeStamp) / 1e6,
        },
    };
}
