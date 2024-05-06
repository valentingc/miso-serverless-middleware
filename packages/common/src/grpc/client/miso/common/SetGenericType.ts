// Original file: src/grpc/common.proto

export const SetGenericType = {
  STRING: 0,
  NUMBER: 1,
  OBJECT: 2,
} as const;

export type SetGenericType =
  | 'STRING'
  | 0
  | 'NUMBER'
  | 1
  | 'OBJECT'
  | 2

export type SetGenericType__Output = typeof SetGenericType[keyof typeof SetGenericType]
