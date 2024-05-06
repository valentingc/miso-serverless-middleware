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
const sdk_1 = require("@miso/sdk");
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
    logger.debug(JSON.stringify(event));
    const statefulObject = context.statefulObject;
    try {
        const map = statefulObject.getORMap('testmap', {
            key: () => 'test',
            value: sdk_1.GCounterProxy,
        });
        let keys = await map.keys();
        console.log('KEYS? ' + JSON.stringify(keys));
        const counter = statefulObject.getGCounter('testgc1');
        const counter2 = statefulObject.getGCounter('test2gc2');
        await counter.add(1);
        await map.set('testgc1', counter);
        await map.set('testgc2', counter2);
        keys = await map.keys();
        console.log('KEYS? ' + JSON.stringify(keys));
    }
    catch (error) {
        console.log('Error while executing function', error);
        throw error;
    }
};
