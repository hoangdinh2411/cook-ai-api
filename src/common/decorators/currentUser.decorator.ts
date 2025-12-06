import { createParamDecorator, UnauthorizedException } from '@nestjs/common';

export const CurrentUser = createParamDecorator((_, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  if (!user) {
    throw new UnauthorizedException('User have to be logged in');
  }
  return user;
});
