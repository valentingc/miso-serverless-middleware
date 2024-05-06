import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectStatefulObject = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToRpc().getData();
    const so = request.statefulObject;
    delete request.statefulObject;
    return so;
  },
);
