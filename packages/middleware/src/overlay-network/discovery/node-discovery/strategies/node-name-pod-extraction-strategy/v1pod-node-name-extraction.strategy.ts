import { V1Pod } from '@kubernetes/client-node';
import { PodNodeNameExtractionStrategy } from '../pod-node-extraction-strategy.interface.js';

export class V1PodNodeNameExtractionStrategy
  implements PodNodeNameExtractionStrategy
{
  extractNodeNameFromPod(pod: V1Pod): string | undefined {
    return pod.metadata?.name ?? undefined;
  }
}
