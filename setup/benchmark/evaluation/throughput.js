import { StatefulObjectProxy } from '@miso/sdk';
import { spawn } from 'child_process';
import { lookup } from 'dns/promises';
const CONF_REQUESTS_PER_SECOND = process.argv[2];
const CONF_DURATION = Number(process.argv[3]);
const CONF_CONCURRENCY = process.argv[4];
const CONF_TEST_TYPE = process.argv[5];
const NR_OF_NODES = Number(process.argv[6]);
const CONF_IP_AND_PORT = process.argv[7];
const podNames = Array.from({ length: NR_OF_NODES }, (_, i) => {
    if (i === 0) {
        return 'testFn-pod';
    }
    return `testFn-pod${i + 1}`;
});
const nodeNames = Array.from({ length: NR_OF_NODES }, (_, i) => {
    if (i === 0) {
        return 'k8s-master-thesis-worker';
    }
    return `k8s-master-thesis-worker${i + 1}`;
});
const nodeIPs = [...nodeNames];
// const nodeIPs = [
//   '172.18.0.7',
//   '172.18.0.3',
//   '172.18.0.6',
//   '172.18.0.5',
//   '172.18.0.4',
// ];
const nodePorts = Array.from({ length: NR_OF_NODES }, (_, i) => {
    return 5001;
});
console.log('process.argv: ', process.argv);
console.log('Node IPs: ' + nodeIPs);
console.log('Node Names: ' + nodeNames);
console.log('Node Ports: ' + nodePorts);
console.log('Pod Names: ' + podNames);
// const nodeIPs = [
//   '127.0.0.1',
//   '127.0.0.1',
//   '127.0.0.1',
//   '127.0.0.1',
//   '127.0.0.1',
// ];
// const nodeIPs = [
//   'k8s-master-thesis-worker',
//   'k8s-master-thesis-worker2',
//   'k8s-master-thesis-worker3',
//   'k8s-master-thesis-worker4',
//   'k8s-master-thesis-worker5',
// ];
// const nodePorts = ['5001', '5001', '5001', '5001', '5001'];
const statefulObjectId = 'afjfsj-afssfjisfa';
const setEnvVariablesForNode = (node) => {
    console.log('ENV VARS FOR NODE: ', node);
    process.env.NODE_ENV = 'production';
    process.env.MISO_HOST_IP = nodeNameIpMap.get(node)?.address ?? 'undefined';
    process.env.MISO_POD_IP = podNames[nodeNames.indexOf(node)]; // not relevant for this experiment
    process.env.MISO_REPLICA_ID = podNames[nodeNames.indexOf(node)];
    process.env.MISO_NODE_NAME = node;
    process.env.MISO_FUNCTION_NAME = 'testFn';
    process.env.MISO_HOST_PORT = String(nodePorts[nodeNames.indexOf(node)]);
};
const statefulObjects = [];
const nodeNameIpMap = new Map();
const getIpAddress = async (nodeName) => {
    try {
        const address = await lookup(nodeName);
        console.log(`IP  of node: ${nodeName} is : ${address}`);
        return address;
    }
    catch (err) {
        console.error(err);
    }
};
const getAllIpAddreses = async () => {
    console.log('Getting all ip addresses for nodes');
    await Promise.all(nodeNames.map(async (nodeName) => {
        const ip = await getIpAddress(nodeName);
        if (!ip) {
            throw new Error('Could not find ip for node: ' + nodeName);
        }
        console.log('Setting ip for node: ' + nodeName + ' to: ' + ip.address);
        nodeNameIpMap.set(nodeName, ip);
    }));
};
const register = async () => {
    await Promise.all(nodeNames.map(async (node, index) => {
        setEnvVariablesForNode(node);
        const statefulObject = new StatefulObjectProxy();
        statefulObjects.push(statefulObject);
        try {
            await statefulObject.registerServerlessFunction();
        }
        catch (error) {
            console.error(error);
        }
        console.log('Registered function pod: ' +
            process.env.MISO_POD_IP +
            ' on node: ' +
            process.env.MISO_NODE_NAME +
            ' with ip: ' +
            process.env.MISO_HOST_IP);
    }));
};
const getGrpcCall = (type) => {
    if (type === 'pncounter') {
        return 'miso.middleware.PNCounterService.Add';
    }
    else if (type === 'gset') {
        return 'miso.middleware.SetService.Add';
    }
    return '';
};
const getPayload = (type, podName) => {
    console.log('Getting Payload for type: ' + type);
    if (type === 'pncounter') {
        return ('{"replicaId": "' +
            podName +
            '","functionBase": {"serverlessFunctionName": "testFn"},"statefulObjectBase": {"crdtName": "pnCounter1","statefulObjectId": "' +
            statefulObjectId +
            '"},"value": 1}');
    }
    else if (type === 'gset') {
        return ('{"replicaId": "' +
            podName +
            '","functionBase": {"serverlessFunctionName": "testFn"},"statefulObjectBase": {"crdtName": "pnCounter1","statefulObjectId": "' +
            statefulObjectId +
            '"},"value": "10", "crdtType": "GSET", "setValueType": "STRING"}');
    }
    return '';
};
getAllIpAddreses().then(() => {
    register().then(() => {
        console.log('Done registering, spawning ghz');
        if (CONF_TEST_TYPE === 'distributed') {
            let maxAmountOfGhzTests = NR_OF_NODES;
            if (maxAmountOfGhzTests > 50) {
                maxAmountOfGhzTests = 50;
            }
            const requestsPerNode = Math.round(CONF_DURATION / maxAmountOfGhzTests);
            for (let i = 0; i < maxAmountOfGhzTests; i++) {
                const nodeName = nodeNames[i];
                const nodePort = nodePorts[i];
                const args = [
                    '--insecure',
                    '--proto',
                    './node_modules/@miso/common/dist/grpc/middleware.proto',
                    '--call',
                    getGrpcCall('pncounter'),
                    `-d`,
                    getPayload('pncounter', podNames[i]),
                    '-c',
                    CONF_CONCURRENCY,
                    // '-O',
                    // 'json',
                    // '-o',
                    // '/data/json/output.json',
                ];
                args.push('-n', requestsPerNode.toString());
                // args.push('-r', '50');
                args.push(nodeNameIpMap.get(nodeName)?.address + ':' + nodePort);
                console.log('Spawning ghz for node: ' +
                    nodeName +
                    ' with args: ' +
                    args.join(' '));
                const ghzTestProcess = spawn(`ghz`, [...args]);
                ghzTestProcess.stdout.on('data', (data) => {
                    console.log(data.toString());
                });
                ghzTestProcess.stderr.on('data', (data) => {
                    console.log(data.toString());
                });
                ghzTestProcess.on('exit', function (code) {
                    console.log(nodeName + ' - child process exited with code ' + code);
                });
            }
        }
        else if (CONF_TEST_TYPE === 'single') {
            const args = [
                '--insecure',
                '--proto',
                './node_modules/@miso/common/dist/grpc/middleware.proto',
                '--call',
                'miso.middleware.PNCounterService.Add',
                `-d`,
                '{"replicaId": "' +
                    'replica1' +
                    '","functionBase": {"serverlessFunctionName": "testFn"},"statefulObjectBase": {"crdtName": "pnCounter1","statefulObjectId": "' +
                    statefulObjectId +
                    '"},"value": 1}',
                '-c',
                CONF_CONCURRENCY,
                // '-O',
                // 'json',
                // '-o',
                // '/data/json/output.json',
            ];
            args.push('-n', CONF_DURATION.toString());
            args.push(CONF_IP_AND_PORT);
            console.log('Spawning ghz for ipAndPort: ' +
                CONF_IP_AND_PORT +
                ' with args: ' +
                args.join(' '));
            const ghzTestProcess = spawn(`ghz`, [...args]);
            ghzTestProcess.stdout.on('data', (data) => {
                console.log(data.toString());
            });
            ghzTestProcess.stderr.on('data', (data) => {
                console.log(data.toString());
            });
            ghzTestProcess.on('exit', function (code) {
                console.log(CONF_IP_AND_PORT + ' - child process exited with code ' + code);
            });
        }
        else {
            console.log('Unsupported test type: ' + CONF_TEST_TYPE);
        }
    });
});
const testDuration = 60 * 60 * 1000; // 60 min
const parallelCalls = NR_OF_NODES;
const min = 0;
const max = NR_OF_NODES;
const makeGrpcPNCounterCall = async () => {
    const startTime = Date.now();
    // use random stateful object
    const index = Math.floor(Math.random() * (max - min) + min);
    console.log('Using stateful object at index: ' + index);
    const statefulObject = statefulObjects[index];
    const counter = statefulObject.getPNCounter('testCounter');
    await counter.add(1);
    await counter.subtract(1);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    return responseTime;
};
const runXTestsInParallel = async (x) => {
    const promises = [];
    for (let i = 0; i < x; i++) {
        promises.push(makeGrpcPNCounterCall());
    }
    try {
        await Promise.all(promises);
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};
export const runTest = async () => {
    const endTime = Date.now() + testDuration;
    let totalRequests = 0;
    while (Date.now() < endTime) {
        await runXTestsInParallel(parallelCalls);
        console.log('Executed ' + parallelCalls + ' requests');
        totalRequests += parallelCalls;
    }
    console.log(`Total requests made: ${totalRequests}`);
    console.log(`Throughput: ${totalRequests / (testDuration / 1000)} requests per second`);
};
// runTest();
