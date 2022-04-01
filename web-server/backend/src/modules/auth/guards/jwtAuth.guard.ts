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
import {
  AccessEnum,
  ALLOWED_SCOPES_KEY,
  AllowedForArgs,
  EndpointAccess,
  UserLevelScopes,
} from '../decorators';
import { messages } from 'src/config';
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
    const [allScopes, request] = this.getRouteScopesAndRequestFrom(context);

    const routeLevelScope = allScopes.find((scope) =>
      Object.values(EndpointAccess).includes(scope as any),
    ) as EndpointAccess;

    const userLevelScopes = (allScopes as UserLevelScopes[]).filter(
      (scope) => !Object.values(EndpointAccess).includes(scope as any),
    );

    if (!allScopes) return true;

    if (!allScopes.length) return true;

    if (routeLevelScope === AccessEnum.PUBLIC) return true;

    if (routeLevelScope === AccessEnum.FORBIDDEN) return false;

    if (routeLevelScope === AccessEnum.DEVELOPMENT_ONLY)
      if (this.configService.get('isDevelopment')) return true;
      else throw new UnauthorizedException(messages.auth.developmentOnly);

    const userModel = await this.authService.verify(
      request.headers.authorization,
    );

    request.user = userModel;

    if (routeLevelScope === AccessEnum.AUTHORIZED) return true;

    const userAccessScopeTypes = new Set(
      userModel.accessScopes.map(({ type }) => type),
    );

    for (const endpointAccessScope of userLevelScopes) {
      if (Array.isArray(endpointAccessScope)) {
        if (endpointAccessScope.every(userAccessScopeTypes.has)) return true;
        continue;
      }

      if (userAccessScopeTypes.has(endpointAccessScope)) return true;
    }
    return false;
  }

  private getRouteScopesAndRequestFrom(context: ExecutionContext) {
    return [
      this.reflector.get<AllowedForArgs>(
        ALLOWED_SCOPES_KEY,
        context.getHandler(),
      ),
      context.getArgByIndex<Request>(0),
    ] as [AllowedForArgs, Request];
  }
}
