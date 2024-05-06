'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = async (event, context) => {
    const statefulObject = context.statefulObject;
    const body = event.body;
    const operation = body.operation;
    context.headers({
        'Content-Type': 'application/json',
    });
    try {
        switch (operation) {
            case 'allreduce-miso':
                return performAllReduceMiso(body, statefulObject);
            case 'result-miso':
                return await getResult(body, statefulObject);
            default:
                throw Error('Unknown operation');
        }
    }
    catch (error) {
        console.log('Error while executing function', error);
        throw error;
    }
};
async function getResult(body, statefulObject) {
    const counter = statefulObject.getPNCounter(body.crdtName);
    const result = await counter.getValue();
    return {
        totalSum: result,
    };
}
async function performAllReduceMiso(body, statefulObject) {
    const counter = statefulObject.getPNCounter(body.crdtName);
    const sum = body.values.reduce((a, b) => a + b, 0);
    counter.add(sum);
    return {
        partialSum: sum,
    };
}
