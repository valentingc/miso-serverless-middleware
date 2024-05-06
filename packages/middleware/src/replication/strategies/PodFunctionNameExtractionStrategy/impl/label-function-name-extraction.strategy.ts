import { V1Pod } from '@kubernetes/client-node';
import { IPodFunctionNameExtractor as IPodFunctionNameExtractionStrategy } from '../pod-extraction-strategy.interface.js';

export class LabelFunctionNameExtractionStrategy
  implements IPodFunctionNameExtractionStrategy
{
  extractFunctionNameFromPod(pod: V1Pod): string | undefined {
    return pod.metadata?.labels?.faas_function ?? undefined;
  }
}
