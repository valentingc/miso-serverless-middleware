import { V1Pod } from '@kubernetes/client-node';

export interface IPodFunctionNameExtractor {
  extractFunctionNameFromPod(pod: V1Pod): string | undefined;
}
