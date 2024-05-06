'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const minio_1 = require("minio");
module.exports = async (event, context) => {
    const body = event.body;
    const operation = body.operation;
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
                return await makeBucket(minioClient, body.crdtName);
            case 'allreduce-minio':
                return performAllReduceMinio(body, minioClient);
            case 'result-minio':
                return await getResultMinio(body, minioClient);
            default:
                throw Error('Unknown operation: ' + operation);
        }
    }
    catch (error) {
        console.error('Error while executing function', error);
    }
};
async function makeBucket(minioClient, bucketName) {
    const exists = await minioClient.bucketExists(bucketName);
    if (exists === false) {
        await minioClient.makeBucket(bucketName);
    }
}
async function getResultMinioAllObjects(body, minioClient) {
    return new Promise((resolve) => {
        const stream = minioClient.listObjects(body.crdtName, '', true, {
            IncludeVersion: true,
        });
        const objects = [];
        stream.on('data', function (obj) {
            objects.push(obj);
        });
        stream.on('end', () => {
            resolve(objects);
        });
    });
}
async function getResultMinio(body, minioClient) {
    let totalResult = 0;
    const objects = (await getResultMinioAllObjects(body, minioClient)).map((obj) => obj.name);
    const getObject = (objName) => {
        return new Promise((resolve, reject) => {
            minioClient.getObject(body.crdtName, objName, function (err, stream) {
                if (err) {
                    return reject(err);
                }
                let objectData = '';
                stream.on('data', (chunk) => {
                    objectData += chunk.toString();
                });
                stream.on('end', () => {
                    resolve(Number.parseFloat(objectData));
                });
            });
        });
    };
    return new Promise(async (resolve) => {
        await Promise.all(objects.map((objName) => getObject(objName))).then((values) => {
            totalResult += values.reduce((a, b) => a + b, 0);
            resolve({
                totalSum: totalResult,
            });
        });
    });
}
async function putObject(bucketName, objectName, buffer, minioClient) {
    return new Promise((resolve, reject) => {
        minioClient.putObject(bucketName, objectName, buffer, function (err, etag) {
            if (err) {
                reject(err);
            }
            resolve(etag);
        });
    });
}
async function performAllReduceMinio(body, minioClient) {
    const sum = body.values.reduce((a, b) => a + b, 0);
    const objectName = 'result/allreduce/' + body.crdtName + '/' + (0, crypto_1.randomUUID)();
    putObject(body.crdtName, objectName, String(sum), minioClient);
    return {
        partialSum: sum,
    };
}
