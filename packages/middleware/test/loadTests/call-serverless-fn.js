import autocannon from 'autocannon';
const URL = 'http://localhost:8080/function/counter';
const DURATION = 30;
const REQUESTS_PER_SECOND = 20;
const PAYLOAD = {
    operation: 'gcounter',
    value: 1,
};
async function runBenchmark() {
    const instance = autocannon({
        url: URL,
        duration: DURATION,
        connections: REQUESTS_PER_SECOND,
        pipelining: 1,
        method: 'POST',
        body: JSON.stringify(PAYLOAD),
        headers: {
            'Content-Type': 'application/json',
        },
    }, onComplete);
    autocannon.track(instance, { renderProgressBar: true });
}
function onComplete(result) {
    console.log(result);
}
runBenchmark();
//# sourceMappingURL=call-serverless-fn.js.map