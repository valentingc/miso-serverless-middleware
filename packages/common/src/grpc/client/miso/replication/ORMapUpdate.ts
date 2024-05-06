// Original file: src/grpc/replication.proto

import type { ORSetUpdate as _miso_replication_ORSetUpdate, ORSetUpdate__Output as _miso_replication_ORSetUpdate__Output } from '../../miso/replication/ORSetUpdate';
import type { ORMapUpdateEntry as _miso_replication_ORMapUpdateEntry, ORMapUpdateEntry__Output as _miso_replication_ORMapUpdateEntry__Output } from '../../miso/replication/ORMapUpdateEntry';

export interface ORMapUpdate {
  'keysOrSet'?: (_miso_replication_ORSetUpdate | null);
  'map'?: ({[key: string]: _miso_replication_ORMapUpdateEntry});
}

export interface ORMapUpdate__Output {
  'keysOrSet': (_miso_replication_ORSetUpdate__Output | null);
  'map': ({[key: string]: _miso_replication_ORMapUpdateEntry__Output});
}
