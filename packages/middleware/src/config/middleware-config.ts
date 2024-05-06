import { Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { existsSync } from 'fs';
const logger = new Logger('Config');

export enum ServerlessPlatform {
  OPENFAAS = 0,
}
export interface KubernetesOptions {
  nodeName: string;
  middlewareNamespace: string;
  functionNamespace: string;
  serviceAccount?: {
    pathToTokenMount?: string;
  };
}
export const KubernetesOptionsDefaults: () => KubernetesOptions = () => {
  const envVars = checkAndRetrieveEnvVariables(['MISO_NODE_NAME']);
  const kubernetesServiceAccountProjectedVolumePath =
    '/var/run/secrets/kubernetes.io/serviceaccount/token';
  if (
    process.env.MISO_KUBERNETES_USER_TOKEN === undefined &&
    existsSync(kubernetesServiceAccountProjectedVolumePath) === false &&
    process.env.MISO_OVERLAY_DISCOVERY_NODE_TYPE === NodeDiscoveryType.K8S
  ) {
    throw new Error(
      'Env variable MISO_KUBERNETES_USER_TOKEN is not set (for local development) and service account token was not projected by k8s',
    );
  }

  return {
    nodeName: envVars['MISO_NODE_NAME'],
    middlewareNamespace:
      process.env.MISO_OVERLAY_DISCOVERY_NODE_K8S_NAMESPACE ?? 'miso',
    functionNamespace:
      process.env.MISO_OVERLAY_DISCOVERY_FUNCTION_K8S_NAMESPACE ?? 'miso-fn',
  };
};
export interface MiddlewareOptions {
  replicationDelayMs: number;
}
export type BaseDiscoveryOptions = {
  thisNodeName: string;
};

export enum FunctionDiscoveryType {
  GRPC = 'grpc-function-discovery',
  K8S = 'k8s-function-discovery',
}
export enum NodeDiscoveryType {
  K8S = 'k8s-node-discovery',
  MDNS = 'mdns-node-discovery',
}
export type MdnsDiscoveryOptions = BaseDiscoveryOptions & {
  type: NodeDiscoveryType.MDNS;
  serviceName: string;
};

export type K8sNodeDiscoveryOptions = BaseDiscoveryOptions & {
  type: NodeDiscoveryType.K8S;
  serviceName: string;
};
export type GrpcFunctionDiscoveryOptions = {
  type: FunctionDiscoveryType.GRPC;
};
export type K8sFunctionDiscoveryOptions = {
  type: FunctionDiscoveryType.K8S;
};
export type NodeDiscoveryOptions =
  | MdnsDiscoveryOptions
  | K8sNodeDiscoveryOptions;

export type FunctionDiscoveryOptions =
  | GrpcFunctionDiscoveryOptions
  | K8sFunctionDiscoveryOptions;

export type OverlayOptions = {
  discovery: {
    node: NodeDiscoveryOptions;
    function: FunctionDiscoveryOptions;
  };
};
export interface MiddlewareConfig {
  serverlessPlatform: ServerlessPlatform;
  serverlessPlatformOptions: KubernetesOptions;
  middlewareOptions: MiddlewareOptions;
  overlay: OverlayOptions;
}
export const getConfig: () => Promise<MiddlewareConfig> = async () => {
  await ConfigModule.envVariablesLoaded;
  // const envVars = checkAndRetrieveEnvVariables(['MISO_SERVERLESS_PLATFORM']);

  // if (
  //   envVars['MISO_SERVERLESS_PLATFORM'] !==
  //   ServerlessPlatform[ServerlessPlatform.OPENFAAS]
  // ) {
  //   throw new Error('Unsupported Serverless Platform');
  // }

  const replicationDelayMs =
    process.env.MISO_MIDDLEWARE_REPLICATION_DELAY_MS || '200';
  const thisNodeName = process.env.MISO_NODE_NAME;
  if (thisNodeName === undefined) {
    throw new Error('Env variable MISO_NODE_NAME is not set');
  }

  let overlayFunctionDiscoveryType = enumFromStringValue(
    FunctionDiscoveryType,
    process.env.MISO_OVERLAY_DISCOVERY_FUNCTION_TYPE,
  );
  if (overlayFunctionDiscoveryType === undefined) {
    logger.log(
      'Env variable MISO_OVERLAY_DISCOVERY_FUNCTION_TYPE is not set, fallback to GRPC Function Discovery',
    );
    overlayFunctionDiscoveryType = FunctionDiscoveryType.GRPC;
  }
  let overlayNodeDiscoveryType = enumFromStringValue(
    NodeDiscoveryType,
    process.env.MISO_OVERLAY_DISCOVERY_NODE_TYPE,
  );
  if (overlayNodeDiscoveryType === undefined) {
    logger.log(
      'Env variable MISO_OVERLAY_DISCOVERY_NODE_TYPE is not set, fallback to MDNS Function Discovery',
    );
    overlayNodeDiscoveryType = NodeDiscoveryType.MDNS;
  }

  const config: MiddlewareConfig = {
    serverlessPlatform:
      ServerlessPlatform[
        (process.env['MISO_SERVERLESS_PLATFORM'] ??
          ServerlessPlatform.OPENFAAS) as keyof typeof ServerlessPlatform
      ],
    serverlessPlatformOptions: KubernetesOptionsDefaults(),
    middlewareOptions: {
      replicationDelayMs: Number.parseInt(replicationDelayMs),
    },
    overlay: {
      discovery: {
        node: {
          thisNodeName: thisNodeName,
          type: overlayNodeDiscoveryType,
          serviceName:
            process.env.MISO_OVERLAY_DISCOVERY_NODE_MDNS_SVC_NAME ??
            'miso-middleware-instance.local',
        },
        function: {
          type: overlayFunctionDiscoveryType,
        },
      },
    },
  };
  logger.debug('Middleware Config: ' + JSON.stringify(config));
  return config;
};

export function checkAndRetrieveEnvVariables(
  envVariableNames: string[],
): Record<string, string> {
  const unsetVariables: string[] = [];
  const envVariableValues: Record<string, string> = {};

  for (const envVarName of envVariableNames) {
    const envVarValue = process.env[envVarName];
    if (!envVarValue) {
      unsetVariables.push(envVarName);
    } else {
      envVariableValues[envVarName] = envVarValue;
    }
  }

  if (unsetVariables.length > 0) {
    const errorMessage = `The following environment variable(s) are not set: ${unsetVariables.join(
      ', ',
    )}`;
    throw new Error(errorMessage);
  }

  return envVariableValues;
}
function enumFromStringValue<T>(
  enm: { [s: string]: T },
  value: string | undefined,
): T | undefined {
  if (value === undefined) {
    return undefined;
  }
  return (Object.values(enm) as unknown as string[]).includes(value)
    ? (value as unknown as T)
    : undefined;
}