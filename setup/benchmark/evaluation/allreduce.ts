import axios from 'axios';
import { Decimal } from 'decimal.js';
import * as fs from 'fs';
import { setTimeout } from 'timers/promises';

const args = process.argv.slice(2); // first two args are node and script path

if (args.length === 2) {
  console.log(
    'Using CLI Arguments! ' + ' Type: ' + args[0] + ', Iterations: ',
    +args[1],
  );
}

/**
 * CONFIG
 */
const NODES = 5;
const CONCURRENT_REQUESTS = 5;
const REPLICATION_DELAY = {
  miso: 7,
  redis: 0,
  minio: 0,
};
/**
 * COMMAND LINE ARGS
 */
console.log('ARGS? ' + JSON.stringify(args));
enum BenchmarkType {
  'miso' = 'miso',
  'redis' = 'redis',
  'minio' = 'minio',
}
const TYPE: BenchmarkType =
  BenchmarkType[args[0] as keyof typeof BenchmarkType] ?? BenchmarkType.miso;
const replicationDelay = REPLICATION_DELAY[TYPE] ?? -1;
const ITERATIONS = Number(args[1]) ?? 1000;
const ARRAY_SIZE = Number(args[2]) ?? 1000 * 1000; // 1 million
const FUNCTION_CHUNK_SIZE = Number(args[3]) ?? 1000;
const RESULT_FILE_PATH =
  '/data/json/benchmark_results_' +
  TYPE +
  '_' +
  ITERATIONS +
  'ITER_' +
  CONCURRENT_REQUESTS +
  'REQ_' +
  NODES +
  'NODES' +
  '.json';

console.log('Configured replication delay for this type? ' + replicationDelay);
console.log('ENV? ' + JSON.stringify(process.env));

interface BenchmarkResult {
  testRun: number;
  operation: string;
  type: string;
  timeWrite: number;
  timeRead: number;
  timeTotal: number;
}
const getArrayReduceSum = (min: number, max: number) => {
  return (max * (max + 1) - (min - 1) * min) / 2;
};

async function runSingleTask(chunk: number[], timeStart: bigint, idx: number) {
  try {
    const response = await axios.post(
      'http://gateway.openfaas.svc.cluster.local:8080/function/allreduce-' +
        TYPE,
      {
        operation: 'allreduce-' + TYPE,
        values: chunk,
        includeValueInResponse: true,
        reset: false,
        crdtName: 'pncounter-' + String(timeStart),
        redisUrl: process.env.REDIS_URL ?? undefined,
        minio: {
          accessToken: process.env.MINIO_ACCESS_TOKEN ?? undefined,
          secretKey: process.env.MINIO_SECRET_KEY ?? undefined,
        },
        miso: {
          register: idx === 0 ? true : false,
        },
      },

      {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      },
    );

    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
async function runWithConcurrency(
  tasks: (() => Promise<any>)[],
  concurrency: number,
) {
  const results: any[] = [];
  const executing = new Set<Promise<any>>();

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

async function init(timeStart: bigint) {
  switch (TYPE) {
    case BenchmarkType.minio:
      console.log('Performing init-minio');
      const { data } = await axios.post(
        'http://gateway.openfaas.svc.cluster.local:8080/function/allreduce-' +
          TYPE,
        {
          operation: 'init-' + TYPE,
          crdtName: 'pncounter-' + String(timeStart),
          minio: {
            accessToken: process.env.MINIO_ACCESS_TOKEN ?? undefined,
            secretKey: process.env.MINIO_SECRET_KEY ?? undefined,
          },
        },
      );
      return data;
  }
}
async function performTest(n: number, timeStart: bigint) {
  await init(timeStart);
  const timeStartAfterInit = process.hrtime.bigint();
  console.log(
    'Init took ' + Number(timeStartAfterInit - timeStart) / 1e6 + 'ms',
  );
  const lowEnd = 0;
  const highEnd = ARRAY_SIZE;

  const array: number[] = [];
  for (let i = lowEnd; i < highEnd; i++) {
    array.push(i);
  }
  const chunks = splitArray(array);

  const tasks = chunks.map((chunk) => () => runSingleTask(chunk, timeStart, n));
  const results = await runWithConcurrency(tasks, CONCURRENT_REQUESTS);
  const timeWrite = process.hrtime.bigint();

  if (replicationDelay > 0) {
    await setTimeout(replicationDelay);
  }

  let isCorrect = false;
  let retryReadCount = 0;
  let axiosData;
  while (isCorrect === false && retryReadCount < 1000) {
    const { data } = await axios.post(
      'http://gateway.openfaas.svc.cluster.local:8080/function/allreduce-' +
        TYPE,
      {
        operation: 'result-' + TYPE,
        values: [],
        crdtName: 'pncounter-' + String(timeStart),
        redisUrl: 'redis://demo01.redis.svc.cluster.local:10868',
        minio: {
          accessToken: process.env.MINIO_ACCESS_TOKEN ?? undefined,
          secretKey: process.env.MINIO_SECRET_KEY ?? undefined,
        },
        miso: {
          register: false,
        },
      },
    );
    axiosData = data;
    isCorrect = axiosData.totalSum === getArrayReduceSum(lowEnd, highEnd - 1);
    if (isCorrect === false) {
      retryReadCount++;
    }
  }

  const timeEnd = process.hrtime.bigint();
  const timeExecution = results.reduce(
    (prev: Decimal, current: any) =>
      prev.add(new Decimal(current.times.durationExecution)),
    new Decimal(0),
  );
  return {
    isCorrect: isCorrect,
    computedSum: axiosData.totalSum,
    operation: 'allreduce',
    type: TYPE,
    timeStart: Number(timeStartAfterInit),
    timeWrite: Number(timeWrite - timeStartAfterInit) / 1e6,
    timeRead: Number(timeEnd - timeWrite) / 1e6,
    timeResult: Number(timeEnd - timeStartAfterInit) / 1e6,
    detailedResults: {
      timeExecution: timeExecution,
      retryReadCount: retryReadCount,
    },
    crdtName: 'pncounter-' + String(timeStart),
  };
}

function splitArray(array: number[], chunkSize = FUNCTION_CHUNK_SIZE) {
  const chunks: number[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}
async function cleanup(timeStart: bigint) {
  if (TYPE === 'minio') {
    const { data } = await axios.post(
      'http://gateway.openfaas.svc.cluster.local:8080/function/allreduce-' +
        TYPE,
      {
        operation: 'cleanup-minio',
        crdtName: 'pncounter-' + String(timeStart),
        minio: {
          accessToken: process.env.MINIO_ACCESS_TOKEN ?? undefined,
          secretKey: process.env.MINIO_SECRET_KEY ?? undefined,
        },
      },
    );
    return true;
  }
}
async function performBenchmark() {
  const max = ITERATIONS;
  const results: BenchmarkResult[] = [];
  const timeStartBenchmark = new Date().toISOString();
  for (let i = 0; i < max; i++) {
    const timeStartTestRun = process.hrtime.bigint();
    const result = await performTest(i, timeStartTestRun);

    console.log(
      'Finished test run : ' +
        (i + 1) +
        '/ ' +
        max +
        ' - correct? ' +
        result.isCorrect +
        ' - timeTotal: ' +
        result.timeResult +
        ' - retryReadCount: ' +
        result.detailedResults.retryReadCount,
    );
    await cleanup(timeStartTestRun);
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
      detailedResults: {
        timeExecution: result.detailedResults.timeExecution,
        retryReadCount: result.detailedResults.retryReadCount,
      },
    };
    appendResultsToFile(timeStartBenchmark, entry);
    results.push(entry);
  }
  const average = (arr: BenchmarkResult[]) =>
    arr.reduce((p, c) => p + c.timeTotal, 0) / arr.length;
  console.log('AVERAGE? ' + average(results));
}

function appendResultsToFile(timeStart: string, result: BenchmarkResult) {
  let existingResults: {
    [key: string]: {
      [key: string]: BenchmarkResult[];
    };
  } = {};

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
