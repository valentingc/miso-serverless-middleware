import { hostname } from 'os';
import { createLoggingInstance } from '../proxies/shared/LoggingUtils';

const logger = createLoggingInstance('StatefulObjectConfiguration');

export type StatefulObjectConfiguration = {
  replicaId: string;
  middlewareNodeIpAddress: string;
  middlewareNodePort: number;
  middlewareNodeName: string;
  functionName: string;
};

export function getConfig(): StatefulObjectConfiguration {
  return createDefaultConfig();
}
export function createDefaultConfig(): StatefulObjectConfiguration {
  logger.info(`NODE ENV? ${process.env.NODE_ENV}`);
  logger.info(`MISO_HOST_IP: ${process.env.MISO_HOST_IP}`);
  logger.info(`MISO_HOST_PORT: ${process.env.MISO_HOST_PORT}`);
  logger.info(`MISO_REPLICA_ID: ${process.env.MISO_REPLICA_ID}`);
  logger.info(`MISO_NODE_NAME: ${process.env.MISO_NODE_NAME}`);
  logger.info(`MISO_FUNCTION_NAME: ${process.env.MISO_FUNCTION_NAME}`);

  if (
    process.env.MISO_NODE_NAME === undefined ||
    process.env.MISO_HOST_IP === undefined ||
    process.env.MISO_FUNCTION_NAME === undefined
  ) {
    throw new Error('Required env vars are not set.');
  }
  let functionName = process.env.MISO_FUNCTION_NAME;
  if (functionName === undefined) {
    let fnPodContainerHostname = hostname();
    fnPodContainerHostname = fnPodContainerHostname.split('-')[0];
    functionName = fnPodContainerHostname;
    logger.info(
      'No MISO_FUNCTION_NAME was supplied. Falling back to hostname as function name: ' +
        functionName,
    );
  }
  const config: StatefulObjectConfiguration = {
    middlewareNodePort: process.env.MISO_HOST_PORT
      ? Number(process.env.MISO_HOST_PORT)
      : 5001,
    middlewareNodeIpAddress:
      process.env.NODE_ENV === 'development-local'
        ? 'host.docker.internal'
        : process.env.MISO_HOST_IP,
    middlewareNodeName: process.env.MISO_NODE_NAME,
    functionName: functionName,
    replicaId: process.env.MISO_REPLICA_ID ?? hostname(),
  };

  return config;
}
