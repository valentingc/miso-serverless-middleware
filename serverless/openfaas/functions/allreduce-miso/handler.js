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
    const statefulObject = context.statefulObject;
    const body = event.body;
    const operation = body.operation;
    if (operation === undefined) {
        throw new Error('Operation is undefined');
    }
    if (body.values === undefined) {
        throw new Error('values is undefined');
    }
    if (body.crdtName === undefined) {
        throw new Error('crdtName is undefined');
    }
    context.headers({
        'Content-Type': 'application/json',
    });
    try {
        switch (operation) {
            case 'allreduce-miso':
                return performAllReduceMiso(body, statefulObject, startTimestamp);
            case 'result-miso':
                return await getResult(body, statefulObject, startTimestamp);
            default:
                throw Error('Unknown operation');
        }
    }
    catch (error) {
        console.log('Error while executing function', error);
        throw error;
    }
};
async function getResult(body, statefulObject, startTimeStamp) {
    const counter = statefulObject.getPNCounter(body.crdtName);
    const result = await counter.getValue();
    const endTime = process.hrtime.bigint();
    return {
        totalSum: result,
        times: {
            start: String(startTimeStamp),
            end: String(endTime),
            durationExecution: Number(endTime - startTimeStamp) / 1e6,
        },
    };
}
async function performAllReduceMiso(body, statefulObject, startTimeStamp) {
    const counter = statefulObject.getPNCounter(body.crdtName);
    try {
        const values = body.values;
        const sum = values.reduce((a, b) => a + b, 0);
        counter.add(sum);
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
    catch (error) {
        console.error(error);
        process.exit(0);
    }
}
