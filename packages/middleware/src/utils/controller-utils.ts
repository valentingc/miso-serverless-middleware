import { miso } from '@miso/common/dist/grpc/server/index.js';

export function getStatefulObjectInformation(
  request:
    | miso.middleware.CounterAddOrSubtractValueRequest
    | miso.middleware.CounterGetValueRequest,
) {
  const crdtName = request.statefulObjectBase?.crdtName;
  if (crdtName === undefined) {
    throw new Error('crdtName is undefined');
  }
  const serverlessFunctionName = request.functionBase?.serverlessFunctionName;
  if (serverlessFunctionName === undefined) {
    throw new Error('serverlessFunctionName is undefined');
  }
  return { crdtName, serverlessFunctionName };
}
