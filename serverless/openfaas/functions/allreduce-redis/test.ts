import axios from 'axios';
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
const ARRAY_SIZE = 1000 * 1000; // 1 million
const FUNCTION_CHUNK_SIZE = 1000;

/**
 * COMMAND LINE ARGS
 */
const ITERATIONS = args.length === 2 ? Number(args[1]) : 1000;
const TYPE = args.length === 2 ? args[0] : 'miso';
const RESULT_FILE_PATH =
  './benchmark_results_' +
  TYPE +
  '_' +
  ITERATIONS +
  'ITER_' +
  CONCURRENT_REQUESTS +
  'REQ_' +
  NODES +
  'NODES' +
  '.json';

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

async function runSingleTask(chunk: number[], timeStart: bigint) {
  try {
    const response = await axios.post(
      'http://localhost:8080/function/allreduce',
      {
        operation: 'allreduce-' + TYPE,
        values: chunk,
        includeValueInResponse: true,
        reset: false,
        crdtName: 'pncounter-' + String(timeStart),
        redisUrl: 'redis://demo01.redis.svc.cluster.local:10868',
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

async function performTest(timeStart: bigint) {
  const lowEnd = 0;
  const highEnd = ARRAY_SIZE;

  const array: number[] = [];
  for (let i = lowEnd; i < highEnd; i++) {
    array.push(i);
  }
  const chunks = splitArray(array);
  console.log(chunks.length + ' chunks');
  const tasks = chunks.map((chunk) => () => runSingleTask(chunk, timeStart));
  const results = await runWithConcurrency(tasks, CONCURRENT_REQUESTS);

  const timeWrite = process.hrtime.bigint();
  await setTimeout(1);
  const { data } = await axios.post(
    'http://localhost:8080/function/allreduce',
    {
      operation: 'result-' + TYPE,
      values: [],
      crdtName: 'pncounter-' + String(timeStart),
      redisUrl: 'redis://demo01.redis.svc.cluster.local:10868',
    },
  );
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

function splitArray(array: number[], chunkSize = FUNCTION_CHUNK_SIZE) {
  const chunks: number[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}

async function performBenchmark() {
  const max = ITERATIONS;
  const results: BenchmarkResult[] = [];
  const timeStartBenchmark = new Date().toISOString();
  for (let i = 0; i < max; i++) {
    const timeStartTestRun = process.hrtime.bigint();
    const result = await performTest(timeStartTestRun);

    console.log(
      'Finished test run : ' +
        (i + 1) +
        '/ ' +
        max +
        ' - correct? ' +
        result.isCorrect +
        ' - result?: ' +
        result.computedSum,
    );

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