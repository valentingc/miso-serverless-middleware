import { V1Pod } from '@kubernetes/client-node';
import { IPodFunctionNameExtractor } from '../pod-extraction-strategy.interface.js';

export class PodFunctionNameExtractor {
  private strategy: IPodFunctionNameExtractor;

  constructor(strategy: IPodFunctionNameExtractor) {
    this.strategy = strategy;
  }

  public extractFunctionNameFromPod(pod: V1Pod): string {
    const result = this.strategy.extractFunctionNameFromPod(pod);

    if (result === undefined) {
      throw new Error('Could not extract function name from pod');
    }
    return result;
  }
}
