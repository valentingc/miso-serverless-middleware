'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function generateStringOfSize(size) {
    const match = size.match(/^([\d.]+)([a-zA-Z]+)$/);
    if (!match) {
        throw new Error('Invalid input format. Use a format like "1mb" or "512kb". Supported units: b, kb, mb, gb');
    }
    const sizeValue = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    const unitMultipliers = {
        b: 1,
        kb: 1024,
        mb: 1024 * 1024,
        gb: 1024 * 1024 * 1024,
    };
    if (!unitMultipliers[unit]) {
        throw new Error('Invalid unit. Use units "b," "kb," "mb," or "gb."');
    }
    const totalBytes = sizeValue * unitMultipliers[unit];
    const buffer = Buffer.alloc(totalBytes);
    return buffer.toString();
}
async function getMVRegisterResponseConcat(body, statefulObject) {
    const register = statefulObject.getMVRegister('MVRegister' + body.size + Date.now() + '');
    body.append = body.append + '';
    const originalRegisterValue = await getRegister(statefulObject, body.size).getValue();
    console.log('got original value');
    const concatResult = (originalRegisterValue[0] ?? '') + body.append;
    await register.assign(concatResult);
    console.log('assigned');
    if (body.includeValueInResponse) {
        return {
            data: await register.getValue(),
        };
    }
    return {};
}
const getRegister = (statefulObject, size) => {
    return statefulObject.getMVRegister('MVRegister' + size);
};
async function getInitResponse(body, statefulObject) {
    const register10kb = getRegister(statefulObject, '10kb');
    await register10kb.assign(generateStringOfSize('10kb'));
    const register0_01Mb = getRegister(statefulObject, '0.01mb');
    await register0_01Mb.assign(generateStringOfSize('0.01mb'));
    const register0_1Mb = getRegister(statefulObject, '0.1mb');
    await register0_01Mb.assign(generateStringOfSize('0.1mb'));
    const register1Mb = getRegister(statefulObject, '1mb');
    await register0_01Mb.assign(generateStringOfSize('1mb'));
    const register2Mb = getRegister(statefulObject, '2mb');
    await register0_01Mb.assign(generateStringOfSize('2mb'));
    const register5Mb = getRegister(statefulObject, '5mb');
    await register0_01Mb.assign(generateStringOfSize('5mb'));
    return {
        acknowledged: true,
    };
}
async function getMVRegisterResponse(body, statefulObject) {
    if (body.value === undefined) {
        throw new Error('Value is undefined');
    }
    body.value = body.value + '';
    try {
        console.log('NUMBER');
        let now = Date.now();
        const mvregisterNumber = statefulObject.getMVRegister('MVRegisterNumber');
        let result = await mvregisterNumber.assign(1);
        console.log(`MVRegister assign Request finished... ${Date.now() - now}ms, Response: ${JSON.stringify(result)}`);
        const resultNumber = await mvregisterNumber.getValue();
        console.log(`MVRegister GetValue finished... ${Date.now() - now}ms, Response: ${JSON.stringify(resultNumber)}`);
        const mvregisterString = statefulObject.getMVRegister('MVRegisterString');
        console.log('STRING');
        now = Date.now();
        result = await mvregisterString.assign('aa');
        console.log(`MVRegister assign Request finished... ${Date.now() - now}ms, Response: ${JSON.stringify(result)}`);
        const resultString = await mvregisterString.getValue();
        console.log(`MVRegister GetValue finished... ${Date.now() - now}ms, Response: ${JSON.stringify(resultNumber)}`);
        const mvregisterObject = statefulObject.getMVRegister('MVRegisterObject');
        console.log('OBJECT');
        now = Date.now();
        result = await mvregisterObject.assign({
            test: 'this is fine',
            tem: 'yes',
        });
        console.log(`MVRegister assign Request finished... ${Date.now() - now}ms, Response: ${JSON.stringify(result)}`);
        const resultObject = await mvregisterObject.getValue();
        console.log(`MVRegister GetValue finished... ${Date.now() - now}ms, Response: ${JSON.stringify(resultObject)}`);
        const resultFinal = {
            number: resultNumber,
            string: resultString,
            object: resultObject,
        };
        return resultFinal;
    }
    catch (error) {
        console.error(error);
    }
}
module.exports = async (event, context) => {
    const statefulObject = context.statefulObject;
    const body = event.body;
    const operation = body.operation;
    if (operation === undefined) {
        throw new Error('Operation is undefined');
    }
    context.headers({
        'Content-Type': 'application/json',
    });
    switch (operation) {
        case 'init':
            return await getInitResponse(body, statefulObject);
        case 'mvregister':
            return await getMVRegisterResponse(body, statefulObject);
        case 'mvregister-concat':
            return { data: await getMVRegisterResponseConcat(body, statefulObject) };
        default:
            throw Error('Unknown operation');
    }
};
