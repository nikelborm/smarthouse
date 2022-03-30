import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export enum Role {
  PUBLIC = 'public',
  AUTHORIZED = 'authorized',
  MANAGER_OR_SENIOR = 'managerOrSenior',
  ADMIN = 'admin',
  SUPER_ADMIN = 'superAdmin',
  DEVELOPMENT_ONLY = 'developmentOnly',
}

export const ROLE_KEY = Symbol('role');

export function Roles(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLE_KEY, roles),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export const Public = () => Roles(Role.PUBLIC);
export const AuthorizedOnly = () => Roles(Role.AUTHORIZED);
export const ManagerOrSeniorOnly = () => Roles(Role.MANAGER_OR_SENIOR);
export const AdminOnly = () => Roles(Role.ADMIN);
export const SuperAdminOnly = () => Roles(Role.SUPER_ADMIN);
export const DevelopmentOnly = () => Roles(Role.DEVELOPMENT_ONLY);
