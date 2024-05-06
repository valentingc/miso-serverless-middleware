// marker interface

import { CRDTSetType } from '@miso/common/dist/grpc/client/miso/common/CRDTSetType.js';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICrdtProxy {
  type: string;
  config: {
    crdtName: string;
    replicaId: string;
    statefulObjectId: string;
    crdtSetType: CRDTSetType;
    serverlessFunctionName: string;
  };
}
