import { V1Pod } from '@kubernetes/client-node';
import { PodNodeNameExtractionStrategy } from '../pod-node-extraction-strategy.interface.js';

export class PodNodeNameExtractor {
  private strategy: PodNodeNameExtractionStrategy;

  constructor(strategy: PodNodeNameExtractionStrategy) {
    this.strategy = strategy;
  }

  public extractNodeNameFromPod(pod: V1Pod): string {
    const result = this.strategy.extractNodeNameFromPod(pod);

    if (result === undefined) {
      throw new Error('Could not extract node name from pod');
    }
    return result;
  }
}
