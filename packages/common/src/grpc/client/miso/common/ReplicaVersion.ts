// Original file: src/grpc/common.proto

import type { Long } from '@grpc/proto-loader';

export interface ReplicaVersion {
  'replicaId'?: (string);
  'version'?: (number | string | Long);
}

export interface ReplicaVersion__Output {
  'replicaId': (string);
  'version': (string);
}
