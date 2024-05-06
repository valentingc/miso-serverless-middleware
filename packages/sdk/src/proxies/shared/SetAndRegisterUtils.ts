import { SetGenericType } from '@miso/common/dist/grpc/client/miso/common/SetGenericType';
import { SetOrRegisterValueResponse } from '@miso/common/dist/grpc/client/miso/common/SetOrRegisterValueResponse';

export function handleSetOrRegisterGrpcResponse<
  T extends string | number | object,
>(response: SetOrRegisterValueResponse): T[] {
  if (response === undefined) {
    throw new Error('No response received');
  }
  switch (response.type) {
    case SetGenericType.NUMBER:
      return (response.valuesNumber?.values as T[]) || [];
    case SetGenericType.STRING:
      return (response.valuesString?.values as T[]) || [];
    case SetGenericType.OBJECT:
      return (response.valuesObject?.values as T[]) || [];
    default:
      throw new Error('Unrecognized set generic type');
  }
}
