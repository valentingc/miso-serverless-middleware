import { V1Pod } from '@kubernetes/client-node';
import { IPodFunctionNameExtractor as IPodFunctionNameExtractionStrategy } from '../pod-extraction-strategy.interface.js';

export class EnvVarFunctionNameExtractionStrategy
  implements IPodFunctionNameExtractionStrategy
{
  extractFunctionNameFromPod(pod: V1Pod): string | undefined {
    const envVars = pod.spec?.containers[0].env;
    if (envVars === undefined || (envVars ?? []).length === 0) {
      return undefined;
    }
    const fnName = envVars?.find(
      (envVar) => envVar.name === 'MISO_FUNCTION_NAME',
    )?.value;
    return fnName;
  }
}
