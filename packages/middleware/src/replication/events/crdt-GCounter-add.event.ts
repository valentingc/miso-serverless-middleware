import { Timestamp } from '@miso/common/dist/grpc/server/index.google.protobuf';
import { IEvent } from './event.interface.js';

export class CrdtGCounterAddEvent implements IEvent {
  crdtName: string;
  statefulObjectId: string;
  serverlessFunctionName: string;
  sentAtUtc: Timestamp | undefined;
  srcMap: Record<string, number>;
  srcCurrentValue: number;
  srcSerialized?: string | undefined;
  srcType?: string | undefined;

  constructor(values: {
    crdtName: string;
    statefulObjectId: string;
    serverlessFunctionName: string;
    sentAtUtc: Timestamp;
    srcMap: Map<string, number>;
    srcCurrentValue: number;
    srcSerialized?: string | undefined;
    srcType?: string | undefined;
  }) {
    this.crdtName = values.crdtName;
    this.statefulObjectId = values.statefulObjectId;
    this.serverlessFunctionName = values.serverlessFunctionName;
    this.sentAtUtc = values.sentAtUtc;

    const srcMapAsRecord: Record<string, number> = {};
    for (const [key, value] of values.srcMap.entries()) {
      srcMapAsRecord[key] = value;
    }
    this.srcMap = srcMapAsRecord;
    this.srcCurrentValue = values.srcCurrentValue;
    this.srcSerialized = values.srcSerialized;
    this.srcType = values.srcType;
  }
}
