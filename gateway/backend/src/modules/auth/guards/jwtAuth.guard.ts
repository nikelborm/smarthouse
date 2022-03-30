import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { repo } from 'src/modules/infrastructure';
import { Role, ROLE_KEY } from '../decorators';
import { messages } from 'src/config';
import { AccessScopeType } from 'src/types';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: repo.UserRepo,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const routeRoles = this.reflector.get<Role[]>(
      ROLE_KEY,
      context.getHandler(),
    );

    if (!routeRoles) return true;
    if (!routeRoles.length) return true;
    if (routeRoles.includes(Role.PUBLIC)) return true;
    if (routeRoles.includes(Role.DEVELOPMENT_ONLY))
      if (this.configService.get('isDevelopment')) return true;
      else throw new UnauthorizedException(messages.auth.developmentOnly);

    const request = context.getArgByIndex<Request>(0);

    const authHeader = request.headers.authorization;

    if (!authHeader)
      throw new UnauthorizedException(messages.auth.missingAuthHeader);

    const userModel = await this.authService.verify(authHeader);

    request.user = userModel;

    if (routeRoles.includes(Role.AUTHORIZED)) return true;

    const userAccessScopeTypes = new Set(
      userModel.accessScopes.map(({ type }) => type),
    );

    for (const routeRole of routeRoles) {
      if (
        routeRole === Role.ADMIN &&
        userAccessScopeTypes.has(AccessScopeType.ADMIN)
      )
        return true;
      if (
        routeRole === Role.SUPER_ADMIN &&
        userAccessScopeTypes.has(AccessScopeType.SUPER_ADMIN)
      )
        return true;
    }
    return false;
  }
}
