import { V1Pod } from '@kubernetes/client-node';

export interface PodNodeNameExtractionStrategy {
  extractNodeNameFromPod(pod: V1Pod): string | undefined;
}
