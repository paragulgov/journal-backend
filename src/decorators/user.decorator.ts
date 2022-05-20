import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserIdDecorator = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.id;
  },
);
