import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { RoleName } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleName[]): MethodDecorator & ClassDecorator => SetMetadata(ROLES_KEY, roles);

export interface AuthenticatedUser {
  userId: string;
  email: string;
  roles: RoleName[];
  customerId?: string;
  supplierId?: string;
}

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): AuthenticatedUser => {
  const request = ctx.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
  if (!request.user) {
    throw new UnauthorizedException('No authenticated user on request');
  }
  return request.user;
});

/** Verifies the JWT access token (see JwtStrategy) and attaches `request.user`. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

/** Enforces the roles declared via @Roles(...) on the route/controller. No roles declared = any authenticated user. */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
    if (!user || !requiredRoles.some((role) => user.roles.includes(role))) {
      throw new ForbiddenException('Insufficient role for this action');
    }
    return true;
  }
}
