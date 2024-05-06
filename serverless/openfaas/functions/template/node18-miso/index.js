// Copyright (c) Alex Ellis 2021. All rights reserved.
// Copyright (c) OpenFaaS Author(s) 2021. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

const express = require('express');
const app = express();
const handler = require('./function/handler');
const bodyParser = require('body-parser');
const misoSdk = require('@miso/sdk');
const { register } = require('module');
const { setTimeout } = require('timers/promises');

const defaultMaxSize = '100kb'; // body-parser default

app.disable('x-powered-by');

const rawLimit = process.env.MAX_RAW_SIZE || defaultMaxSize;
const jsonLimit = process.env.MAX_JSON_SIZE || defaultMaxSize;

app.use(function addDefaultContentType(req, res, next) {
  // When no content-type is given, the body element is set to
  // nil, and has been a source of contention for new users.

  if (!req.headers['content-type']) {
    req.headers['content-type'] = 'text/plain';
  }
  next();
});

if (process.env.RAW_BODY === 'true') {
  app.use(bodyParser.raw({ type: '*/*', limit: rawLimit }));
} else {
  app.use(bodyParser.text({ type: 'text/*' }));
  app.use(bodyParser.json({ limit: jsonLimit }));
  app.use(bodyParser.urlencoded({ extended: true }));
}

const isArray = (a) => {
  return !!a && a.constructor === Array;
};

const isObject = (a) => {
  return !!a && a.constructor === Object;
};

class FunctionEvent {
  constructor(req) {
    this.body = req.body;
    this.headers = req.headers;
    this.method = req.method;
    this.query = req.query;
    this.path = req.path;
  }
}
const statefulObject = new misoSdk.StatefulObjectProxy();

const registerMiso = async (statefulObject) => {
  try {
    await statefulObject.registerServerlessFunction();
    console.log('Registered serverless function with MISO middleware');

    await watchConnectivityState(statefulObject);
  } catch (error) {
    console.error('Unable to register with MISO:', error);
    throw error;
  }
};

const watchConnectivityState = async (statefulObject) => {
  const channel = statefulObject.getChannel();
  if (channel === undefined) {
    console.error('Undefined channel');
    return;
  }
  const current = channel.getConnectivityState(true);
  channel?.watchConnectivityState(current, Infinity, async (error) => {
    console.log(`Channel error - retrying in 3s: ${error}`);
    await setTimeout(3000);
    registerMiso(statefulObject);
  });
  console.log('Watching for connectivity changes');
};

registerMiso(statefulObject).then(() => {
  process.once('SIGTERM', function (code) {
    console.log('SIGTERM received, unregistering from MISO middleware');
    statefulObject.unregisterServerlessFunction();
  });

  class FunctionContext {
    constructor(cb) {
      this.statusCode = 200;
      this.cb = cb;
      this.headerValues = {};
      this.cbCalled = 0;
      this.statefulObject = statefulObject;
    }

    status(statusCode) {
      if (!statusCode) {
        return this.statusCode;
      }

      this.statusCode = statusCode;
      return this;
    }

    headers(value) {
      if (!value) {
        return this.headerValues;
      }

      this.headerValues = value;
      return this;
    }

    succeed(value) {
      let err;
      this.cbCalled++;
      this.cb(err, value);
    }

    fail(value) {
      let message;
      if (this.status() == '200') {
        this.status(500);
      }

      this.cbCalled++;
      this.cb(value, message);
    }
  }

  let timestampStart;

  const middleware = async (req, res) => {
    timestampStart = Date.now();
    const cb = (err, functionResult) => {
      if (err) {
        console.error(err);

        return res
          .status(fnContext.status())
          .send(err.toString ? err.toString() : err);
      }

      const headers = {
        ...fnContext.headers(),
        'X-Function-Execution-Time-Ms': Date.now() - timestampStart,
      };

      if (isArray(functionResult) || isObject(functionResult)) {
        res
          .set(headers)
          .status(fnContext.status())
          .send(JSON.stringify(functionResult));
      } else {
        res.set(headers).status(fnContext.status()).send(functionResult);
      }
    };
    const fnEvent = new FunctionEvent(req);
    const fnContext = new FunctionContext(cb);

    // await registerMiso(statefulObject);

    Promise.resolve(handler(fnEvent, fnContext, cb))
      .then((res) => {
        if (!fnContext.cbCalled) {
          fnContext.succeed(res);
        }
      })
      .catch((e) => {
        cb(e);
      });
  };

  app.post('/*', middleware);
  app.get('/*', middleware);
  app.patch('/*', middleware);
  app.put('/*', middleware);
  app.delete('/*', middleware);
  app.options('/*', middleware);

  const port = process.env.http_port || 3000;

  app.listen(port, () => {
    console.log(`node18 listening on port: ${port}`);
  });
});