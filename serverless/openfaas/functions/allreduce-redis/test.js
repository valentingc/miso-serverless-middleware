"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const promises_1 = require("timers/promises");
const args = process.argv.slice(2); // first two args are node and script path
if (args.length === 2) {
    console.log('Using CLI Arguments! ' + ' Type: ' + args[0] + ', Iterations: ', +args[1]);
}
/**
 * CONFIG
 */
const NODES = 5;
const CONCURRENT_REQUESTS = 5;
const ARRAY_SIZE = 1000 * 1000; // 1 million
const FUNCTION_CHUNK_SIZE = 1000;
/**
 * COMMAND LINE ARGS
 */
const ITERATIONS = args.length === 2 ? Number(args[1]) : 1000;
const TYPE = args.length === 2 ? args[0] : 'miso';
const RESULT_FILE_PATH = './benchmark_results_' +
    TYPE +
    '_' +
    ITERATIONS +
    'ITER_' +
    CONCURRENT_REQUESTS +
    'REQ_' +
    NODES +
    'NODES' +
    '.json';
const getArrayReduceSum = (min, max) => {
    return (max * (max + 1) - (min - 1) * min) / 2;
};
async function runSingleTask(chunk, timeStart) {
    try {
        const response = await axios_1.default.post('http://localhost:8080/function/allreduce', {
            operation: 'allreduce-' + TYPE,
            values: chunk,
            includeValueInResponse: true,
            reset: false,
            crdtName: 'pncounter-' + String(timeStart),
            redisUrl: 'redis://demo01.redis.svc.cluster.local:10868',
        }, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });
        return response.data;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
async function runWithConcurrency(tasks, concurrency) {
    const results = [];
    const executing = new Set();
    for (const task of tasks) {
        const p = Promise.resolve().then(() => task());
        results.push(p);
        executing.add(p);
        const cleanUp = () => executing.delete(p);
        p.then(cleanUp).catch(cleanUp);
        if (executing.size >= concurrency) {
            await Promise.race(executing);
        }
    }
    return (await Promise.all(results)).filter((result) => result !== null);
}
async function performTest(timeStart) {
    const lowEnd = 0;
    const highEnd = ARRAY_SIZE;
    const array = [];
    for (let i = lowEnd; i < highEnd; i++) {
        array.push(i);
    }
    const chunks = splitArray(array);
    console.log(chunks.length + ' chunks');
    const tasks = chunks.map((chunk) => () => runSingleTask(chunk, timeStart));
    const results = await runWithConcurrency(tasks, CONCURRENT_REQUESTS);
    const timeWrite = process.hrtime.bigint();
    await (0, promises_1.setTimeout)(1);
    const { data } = await axios_1.default.post('http://localhost:8080/function/allreduce', {
        operation: 'result-' + TYPE,
        values: [],
        crdtName: 'pncounter-' + String(timeStart),
        redisUrl: 'redis://demo01.redis.svc.cluster.local:10868',
    });
    const timeEnd = process.hrtime.bigint();
    return {
        isCorrect: data.totalSum === getArrayReduceSum(lowEnd, highEnd - 1),
        computedSum: data.totalSum,
        operation: 'allreduce',
        type: TYPE,
        timeWrite: Number(timeWrite - timeStart) / 1e6,
        timeResult: Number(timeEnd - timeStart) / 1e6,
        timeRead: Number(timeEnd - timeWrite) / 1e6,
        timeStart: Number(timeStart),
        crdtName: 'pncounter-' + String(timeStart),
    };
}
function splitArray(array, chunkSize = FUNCTION_CHUNK_SIZE) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    return chunks;
}
async function performBenchmark() {
    const max = ITERATIONS;
    const results = [];
    const timeStartBenchmark = new Date().toISOString();
    for (let i = 0; i < max; i++) {
        const timeStartTestRun = process.hrtime.bigint();
        const result = await performTest(timeStartTestRun);
        console.log('Finished test run : ' +
            (i + 1) +
            '/ ' +
            max +
            ' - correct? ' +
            result.isCorrect +
            ' - result?: ' +
            result.computedSum);
        const entry = {
            testRun: i + 1,
            operation: result.operation,
            type: result.type,
            timeStart: result.timeStart,
            timeWrite: result.timeWrite,
            timeRead: result.timeRead,
            timeTotal: result.timeResult,
            computedSum: result.computedSum,
            isCorrect: result.isCorrect,
            crdtName: result.crdtName,
        };
        appendResultsToFile(timeStartBenchmark, entry);
        results.push(entry);
    }
    const average = (arr) => arr.reduce((p, c) => p + c.timeTotal, 0) / arr.length;
    console.log('AVERAGE? ' + average(results));
}
function appendResultsToFile(timeStart, result) {
    let existingResults = {};
    if (fs.existsSync(RESULT_FILE_PATH)) {
        existingResults = JSON.parse(fs.readFileSync(RESULT_FILE_PATH, 'utf8'));
    }
    if (!existingResults[result.type]) {
        existingResults[result.type] = {};
    }
    const timeStartKey = timeStart;
    if (!existingResults[result.type][timeStartKey]) {
        existingResults[result.type][timeStartKey] = [];
    }
    existingResults[result.type][timeStartKey].push(result);
    fs.writeFileSync(RESULT_FILE_PATH, JSON.stringify(existingResults, null, 2));
}
performBenchmark().catch((err) => console.error(err));
