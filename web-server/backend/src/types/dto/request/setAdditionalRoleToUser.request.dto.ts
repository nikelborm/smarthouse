import { IsEnum, IsPositive } from 'class-validator';

export enum UserAdditionalRole {
  NONE = 'none',
  ADMIN = 'admin',
  SUPER_ADMIN = 'superAdmin',
}

export class SetAdditionalRoleToUserDTO {
  @IsPositive()
  userId: number;

  @IsEnum(UserAdditionalRole)
  additionalRole: UserAdditionalRole;
}
