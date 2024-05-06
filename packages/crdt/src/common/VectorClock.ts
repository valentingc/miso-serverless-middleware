export enum VectorClockComparison {
  THIS_CLOCK_IS_GREATER = 'THIS_CLOCK_IS_GREATER',
  OTHER_CLOCK_IS_GREATER = 'OTHER_CLOCK_IS_GREATER',
  CONCURRENT = 'CONCURRENT',
  EQUAL = 'EQUAL',
}
export class VectorClock {
  private map: Map<string, number>;

  constructor(map?: Map<string, number>) {
    this.map = map ?? new Map();
  }

  getMapEntries(): IterableIterator<[string, number]> {
    return this.map.entries();
  }

  increment(replicaId: string) {
    let version = this.map.get(replicaId);
    if (version === undefined) {
      version = 1;
      this.map.set(replicaId, version);
    } else {
      version += 1;
      this.map.set(replicaId, version);
    }
    return version;
  }

  getVersion(replicaId: string) {
    return this.map.get(replicaId) ?? -1;
  }

  merge(other: VectorClock): void {
    for (const [replicaId, otherVersion] of other.map.entries()) {
      if (this.map.has(replicaId)) {
        const thisVersion = this.map.get(replicaId) ?? -1;
        if (thisVersion < otherVersion) {
          this.map.set(replicaId, otherVersion);
        }
      } else {
        this.map.set(replicaId, otherVersion);
      }
    }
  }

  compare(otherClock: VectorClock): VectorClockComparison {
    let thisClockIsGreater = false;
    let otherClockIsGreater = false;

    for (const [replicaId, timestamp] of this.map.entries()) {
      const otherTimestamp = otherClock.map.get(replicaId) || 0;

      if (timestamp < otherTimestamp) {
        otherClockIsGreater = true;
      } else if (timestamp > otherTimestamp) {
        thisClockIsGreater = true;
      }
    }

    for (const [replicaId, timestamp] of otherClock.map.entries()) {
      if (!this.map.has(replicaId)) {
        otherClockIsGreater = true;
      }
    }

    if (thisClockIsGreater && otherClockIsGreater) {
      return VectorClockComparison.CONCURRENT;
    } else if (thisClockIsGreater) {
      return VectorClockComparison.THIS_CLOCK_IS_GREATER;
    } else if (otherClockIsGreater) {
      return VectorClockComparison.OTHER_CLOCK_IS_GREATER;
    } else {
      return VectorClockComparison.EQUAL;
    }
  }

  toString(): string {
    let result = '[';
    let isFirst = true;
    for (const [replicaId, version] of this.map.entries()) {
      if (!isFirst) {
        result += ', ';
      }
      result += `${replicaId} ${version}`;
      isFirst = false;
    }
    result += ']';
    return result;
  }

  clone(): VectorClock {
    const clonedClock = new VectorClock();
    for (const [clientId, version] of this.map.entries()) {
      clonedClock.map.set(clientId, version);
    }
    return clonedClock;
  }
}
