import { V1Pod } from '@kubernetes/client-node';
import { Logger } from '@nestjs/common';
import { jsonMapReplacer } from '../../../../../utils/json.utils.js';
import { PodNodeNameExtractionStrategy } from '../pod-node-extraction-strategy.interface.js';

export class EnvVarNodeNameExtractionStrategy
  implements PodNodeNameExtractionStrategy
{
  private logger: Logger = new Logger(EnvVarNodeNameExtractionStrategy.name);
  extractNodeNameFromPod(pod: V1Pod): string | undefined {
    this.logger.verbose(
      'Extracting node name from pod: ' + JSON.stringify(pod, jsonMapReplacer),
    );
    const envVars = pod.spec?.containers[0].env;
    this.logger.verbose('EnvVar? ' + JSON.stringify(envVars, jsonMapReplacer));
    if (envVars === undefined || (envVars ?? []).length === 0) {
      return undefined;
    }
    const fnName = envVars?.find(
      (envVar) => envVar.name === 'MISO_NODE_NAME',
    )?.value;
    return fnName;
  }
}
