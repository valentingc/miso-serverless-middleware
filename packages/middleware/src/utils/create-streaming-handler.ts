import { Observable, Subject } from 'rxjs';
import { ObjectsService } from '../objects/objects.service.js';
import { StatefulObject } from '../objects/stateful-object.js';

type HandlerFunctionWithStatefulObject<PayloadType, ResponseType> = (
  payload: PayloadType,
  statefulObject: StatefulObject,
) => Promise<ResponseType> | ResponseType;

// pattern: currying
export function createGrpcStreamingHandlerWithStatefulObject<
  PayloadType,
  ResponseType,
>(
  handler: HandlerFunctionWithStatefulObject<PayloadType, ResponseType>,
  objectService: ObjectsService,
): (request: Observable<PayloadType>) => Observable<ResponseType> {
  return (request: Observable<PayloadType>) => {
    const subject = new Subject<ResponseType>();

    const onNext = async (message: PayloadType) => {
      let data;
      const serverlessFunctionName = (message as any).functionBase
        ?.serverlessFunctionName;
      const statefulObjectId = (message as any).statefulObjectBase
        ?.statefulObjectId;
      if (
        serverlessFunctionName !== undefined &&
        statefulObjectId !== undefined
      ) {
        const hasStatefulObject = objectService.hasStatefulObject(
          serverlessFunctionName,
          statefulObjectId,
        );
        let statefulObject;
        if (hasStatefulObject === true) {
          statefulObject = objectService.getStatefulObject(
            statefulObjectId,
            serverlessFunctionName,
          );
        } else {
          statefulObject = objectService.createStatefulObject(
            statefulObjectId,
            serverlessFunctionName,
          );
        }

        data = await handler(message, statefulObject);
      } else {
        throw new Error(
          `StatefulObjectId or ServerlessFunctionName is missing. Make sure the request has the property "statefulObjectBase.statefulObjectId" and "functionBase.serverlessFunctionName"`,
        );
      }
      subject.next(data);
    };

    const onComplete = () => {
      subject.complete();
    };

    request.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return subject.asObservable();
  };
}
