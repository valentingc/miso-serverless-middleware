import { spawn } from 'child_process';
import express from 'express';

const app = express();
const port = 3000;

let allReduceTestProcess = null;
let throughputTestProcess = null;
let ghzTestProcess = null;
console.log('ENV? ' + JSON.stringify(process.env));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/throughput', (req, res) => {
  if (throughputTestProcess) {
    return res.status(400).send('Test already running');
  }
  const scriptPath = './throughput.js';

  throughputTestProcess = spawn(`node`, [scriptPath]);

  throughputTestProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  throughputTestProcess.stderr.on('data', (data) => {
    console.log(data.toString());
  });

  throughputTestProcess.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    throughputTestProcess = null;
  });
  res.send('Test started');
});

app.post(
  '/throughput-ghz/:rps/:duration/:concurrency/:testType/:nrOfNodes/:ipAndPort?',
  (req, res) => {
    if (ghzTestProcess) {
      return res.status(400).send('Test already running');
    }
    const scriptPath = './throughput.js';

    const ipAndPort = req.params.ipAndPort ?? '172.18.0.4:30001';
    const rps = req.params.rps;
    const duration = req.params.duration;
    const concurrency = req.params.concurrency;
    const testType = req.params.testType;

    const nrOfNodes = req.params.nrOfNodes;
    ghzTestProcess = spawn(`node`, [
      scriptPath,
      rps,
      duration,
      concurrency,
      testType,
      nrOfNodes,
      ipAndPort,
    ]);

    ghzTestProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    ghzTestProcess.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    ghzTestProcess.on('exit', function (code) {
      console.log('child process exited with code ' + code);
      ghzTestProcess = null;
    });
    res.send('Ghz Test started');
  },
);

app.post('/allreduce/:type/:repetitions/:arraySize/:chunkSize', (req, res) => {
  if (allReduceTestProcess) {
    return res.status(400).send('Test already running');
  }
  const type = req.params.type;
  const repetitions = req.params.repetitions;
  const arraySize = req.params.arraySize;
  const chunkSize = req.params.chunkSize;
  const scriptPath = './allreduce.js';

  allReduceTestProcess = spawn(`node`, [
    scriptPath,
    type,
    String(repetitions ?? 1000),
    Number(arraySize ?? 1000 * 1000),
    Number(chunkSize ?? 1000),
  ]);

  allReduceTestProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  allReduceTestProcess.stderr.on('data', (data) => {
    console.log(data.toString());
  });

  allReduceTestProcess.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    allReduceTestProcess = null;
  });
  res.send('Test started');
});

app.post('/stop', (req, res) => {
  if (!allReduceTestProcess && !throughputTestProcess && !ghzTestProcess) {
    return res.status(400).send('No test is running');
  }
  if (allReduceTestProcess) {
    allReduceTestProcess.kill();
    allReduceTestProcess = null;
  }

  if (throughputTestProcess) {
    throughputTestProcess.kill();
    throughputTestProcess = null;
  }

  if (ghzTestProcess) {
    ghzTestProcess.kill();
    ghzTestProcess = null;
  }
  res.send('Test stopped');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
