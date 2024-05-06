'use strict';
const winston = require('winston');
var Minio = require('minio');
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(
      (info) =>
        `${info.timestamp} [FN] [${info.level}]: ${info.message}` +
        (info.splat !== undefined ? `${info.splat}` : ' '),
    ),
  ),
  defaultMeta: { service: 'fn-set' },
  transports: [new winston.transports.Console()],
});

/**
 * Main entry point of the function.
 * Depending on the "operation" key in the body, a different method will be called
 */
module.exports = async (event, context) => {
  logger.debug(JSON.stringify(event));
  var minioClient = new Minio.Client({
    endPoint: 'minio.minio-tenant01.svc.cluster.local',
    useSSL: false,
    accessKey: '3RlDxxLSUNzIuwZi',
    secretKey: '4HdOLnuJ7YBj16E3nlvmPY9yLWt0XVd0',
  });
  var buffer = 'Hello World';
  const begin = Date.now();
  let writeTime;
  minioClient.putObject(
    'allreduce',
    'hello-file-fn-dns',
    buffer,
    function (err, etag) {
      const end = Date.now();
      writeTime = end - begin;
      console.log('Write: ' + writeTime + 'ms');
      return console.log(err, etag); // err should be null
    },
  );

  const beginRead = Date.now();
  let readTime;
  minioClient.getObject(
    'allreduce',
    'hello-file-fn-dns',
    function (err, stream) {
      if (err) {
        return console.error('Error retrieving object:', err);
      }

      let objectData = '';

      // Read the data stream and concatenate it to get the object content
      stream.on('data', (chunk) => {
        objectData += chunk.toString();
      });

      stream.on('end', () => {
        console.log('Retrieved object content:', objectData);
        const endRead = Date.now();
        readTime = endRead - beginRead;
        console.log('Read: ' + readTime + 'ms');
      });

      stream.on('error', (err) => {
        console.error('Error reading object data:', err);
      });
    },
  );
};
