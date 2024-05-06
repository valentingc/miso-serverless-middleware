import { createLogger, format, transports } from 'winston';

export function createLoggingInstance(
  // eslint-disable-next-line @typescript-eslint/ban-types
  classNameOrConstructor: Function | string,
) {
  const NODE_ENV = process.env.NODE_ENV ?? 'development';
  return createLogger({
    level: NODE_ENV === 'development' ? 'debug' : 'info',
    format: format.combine(
      format.colorize(),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.printf(
        (info) =>
          `${info.timestamp} [SDK] [${info.level}]: ${info.message}` +
          (info.splat !== undefined ? `${info.splat}` : ' '),
      ),
    ),
    transports:
      NODE_ENV === 'development'
        ? [
            new transports.Console({
              level: 'debug',
            }),
          ]
        : [
            new transports.Console({
              level: 'info',
            }),
          ],
  });
}
