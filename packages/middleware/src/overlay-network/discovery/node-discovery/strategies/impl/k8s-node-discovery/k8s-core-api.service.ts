import { CoreV1Api, KubeConfig, Watch } from '@kubernetes/client-node';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  KubernetesOptions,
  MiddlewareConfig,
} from '../../../../../../config/middleware-config.js';
@Injectable()
export abstract class K8sCoreApiService {
  protected coreK8sApi: CoreV1Api;
  protected kubeOptions: KubernetesOptions;
  private kubeConfig: KubeConfig;
  private loggerSuperclass: Logger = new Logger(K8sCoreApiService.name);

  constructor(
    private configService: ConfigService<MiddlewareConfig>,
    protected eventEmitter2: EventEmitter2,
  ) {
    this.kubeConfig = new KubeConfig();

    if (process.env.MISO_KUBERNETES_USER_TOKEN === undefined) {
      this.loggerSuperclass.debug('Using in-cluster config');
      this.kubeConfig.loadFromCluster();
    } else {
      this.loggerSuperclass.debug('Using default config');
      this.kubeConfig.loadFromDefault();
    }

    const kubeOptions = configService.get<KubernetesOptions>(
      'serverlessPlatformOptions',
    );
    if (kubeOptions === undefined) {
      throw new Error('kubeOptions missing, Config not working as expected');
    }
    this.kubeOptions = kubeOptions;

    this.coreK8sApi = this.kubeConfig.makeApiClient(CoreV1Api);
  }

  async watchNamespacedPods(
    namespace: string,
    callback: (type: string, apiObj: any, watchObj: any) => any,
    labelSelector?: string,
    fieldSelector?: string,
    retryCount = 0,
  ) {
    if (retryCount >= 5) {
      return Promise.reject('Retry count reached');
    }
    const watch = new Watch(this.kubeConfig);

    const watchOptionsQueryParams: any = {
      allowWatchBookmarks: true,
    };
    if (labelSelector !== undefined) {
      watchOptionsQueryParams['labelSelector'] = labelSelector;
    }
    if (fieldSelector !== undefined) {
      watchOptionsQueryParams['fieldSelector'] = fieldSelector;
    }
    this.loggerSuperclass.debug('Starting watch for namespace: ' + namespace);
    await watch.watch(
      `/api/v1/namespaces/${namespace}/pods`,
      watchOptionsQueryParams,
      callback,
      (err) => {
        if (err) {
          this.loggerSuperclass.error('Watch terminated with error:', err);
        } else {
          this.loggerSuperclass.debug('Watch terminated.');
          this.watchNamespacedPods(
            namespace,
            callback,
            labelSelector,
            fieldSelector,
            retryCount++,
          );
        }
      },
    );
  }
}
