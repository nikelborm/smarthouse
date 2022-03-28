import { Request } from 'express';
import type { AccessScopeType, AccessScopeTypeClarification } from 'src/types';

export interface UserAuthTokenPayload {
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface UserAuthInfo {
  id: number;
  firstName: string;
  lastName: string;
  accessScopes: {
    id: number;
    type: AccessScopeType;
    name: string;
    typeClarification?: AccessScopeTypeClarification;
  }[];
}

export interface AuthedRequest extends Request {
  user: UserAuthInfo;
}

export {
  Role,
  Roles,
  Public,
  AuthorizedOnly,
  ManagerOrSeniorOnly,
  AdminOnly,
  SuperAdminOnly,
  DevelopmentOnly,
} from './decorators';

export { AuthModule } from './auth.module';
