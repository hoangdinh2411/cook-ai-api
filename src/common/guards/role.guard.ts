import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from 'common/decorators/roles.decorator';
import { ROLES } from 'common/constants/enums';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic || request.skipRoles) {
      return true;
    }
    const requiredRoles =
      this.reflector.get<ROLES[]>(ROLE_KEY, context.getHandler()) || [];
    if (requiredRoles.length === 0) {
      throw new BadRequestException(
        'Set public for this api if not require role',
      );
    }
    const user = context.switchToHttp().getRequest().user;
    if (!user.role) {
      throw new UnauthorizedException('This account missing role');
    }
    if (!requiredRoles.includes(user.role)) {
      throw new UnauthorizedException('Access denied');
    }
    return true;
  }
}
