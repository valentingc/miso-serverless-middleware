import { CRDTSetType } from '@miso/common/dist/grpc/client/miso/common/CRDTSetType';
import { SetGenericType } from '@miso/common/dist/grpc/client/miso/common/SetGenericType';
import { SetOrRegisterSetValueRequest } from '@miso/common/dist/grpc/client/miso/middleware/SetOrRegisterSetValueRequest';
import { createLoggingInstance } from './LoggingUtils';

const logger = createLoggingInstance('GrpcCall');

export function encodeSetValueType(
  value: string | number | object,
  setValueType: SetGenericType,
) {
  let val;
  switch (setValueType) {
    case SetGenericType.NUMBER:
      val = value.toString();
      break;
    case SetGenericType.OBJECT:
      val = JSON.stringify(value);
      break;
    case SetGenericType.STRING:
      val = value.toString();
      break;
    default:
      val = value.toString();
      break;
  }
  return val;
}

export function getSetGenericType(value: string | number | object) {
  const setValueType =
    typeof value === 'string'
      ? SetGenericType.STRING
      : typeof value === 'number'
      ? SetGenericType.NUMBER
      : typeof value === 'object'
      ? SetGenericType.OBJECT
      : SetGenericType.OBJECT;
  return setValueType;
}

export function getPayloadForSetOrRegisterSetValueRequest(
  value: string | number | object,
  setValueType: SetGenericType,
  config: {
    crdtName: string;
    replicaId: string;
    statefulObjectId: string;
    crdtSetType: CRDTSetType;
    serverlessFunctionName: string;
  },
): SetOrRegisterSetValueRequest {
  const val = encodeSetValueType(value, setValueType);

  const result: SetOrRegisterSetValueRequest = {
    functionBase: {
      serverlessFunctionName: config.serverlessFunctionName,
    },
    statefulObjectBase: {
      crdtName: config.crdtName,
      statefulObjectId: config.statefulObjectId,
    },
    replicaId: config.replicaId,
    value: val,
    setValueType: setValueType,
    crdtType: config.crdtSetType,
  };
  logger.debug(
    'getPayloadForSetOrRegisterSetValueRequest:' + JSON.stringify(result),
  );
  return result;
}

export async function makeGrpcCall<RequestType, ResponseType>(
  methodRef: (
    payload: RequestType,
    callback: (err: any, response: any) => void,
  ) => void,
  payload: RequestType,
): Promise<ResponseType> {
  logger.debug('PAYLOAD BEFORE GRPC CALL: ' + JSON.stringify(payload));
  return new Promise<ResponseType>((resolve, reject) => {
    return methodRef(payload, (err: any, response: any) => {
      if (err) {
        return reject(err);
      }
      logger.debug('GRPC RESPONSE: ' + JSON.stringify(response));
      if (response === undefined) {
        throw new Error('No response');
      }
      resolve(response);
    });
  });
}
