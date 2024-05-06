// Original file: src/grpc/discovery-function.proto

export const ServerlessFunctionPodInfoRequestType = {
  ADDED: 0,
  REMOVED: 1,
} as const;

export type ServerlessFunctionPodInfoRequestType =
  | 'ADDED'
  | 0
  | 'REMOVED'
  | 1

export type ServerlessFunctionPodInfoRequestType__Output = typeof ServerlessFunctionPodInfoRequestType[keyof typeof ServerlessFunctionPodInfoRequestType]
