// Original file: src/grpc/common.proto

import type { Long } from '@grpc/proto-loader';

export interface CausalCrdtVectorClock {
  'srcVectorClock'?: ({[key: string]: number | string | Long});
}

export interface CausalCrdtVectorClock__Output {
  'srcVectorClock': ({[key: string]: string});
}
