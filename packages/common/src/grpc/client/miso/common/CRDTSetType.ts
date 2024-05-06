// Original file: src/grpc/common.proto

export const CRDTSetType = {
  MVREGISTER: 0,
  ORSET: 1,
  GSET: 2,
  GCOUNTER: 3,
  PNCOUNTER: 4,
  EWFLAG: 5,
  ORMAP: 6,
} as const;

export type CRDTSetType =
  | 'MVREGISTER'
  | 0
  | 'ORSET'
  | 1
  | 'GSET'
  | 2
  | 'GCOUNTER'
  | 3
  | 'PNCOUNTER'
  | 4
  | 'EWFLAG'
  | 5
  | 'ORMAP'
  | 6

export type CRDTSetType__Output = typeof CRDTSetType[keyof typeof CRDTSetType]
