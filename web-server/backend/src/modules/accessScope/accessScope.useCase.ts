import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { repo } from '../infrastructure';
import { AccessScopeType, UserAdditionalRole } from 'src/types';
import { UserAuthInfo } from '../auth';
import { messages } from 'src/config';

@Injectable()
export class AccessScopeUseCase {
  constructor(
    private readonly accessScopeRepo: repo.AccessScopeRepo,
    private readonly userRepo: repo.UserRepo,
  ) {}

  async setAdditionalRoleToUser(
    userId: number,
    additionalRole: UserAdditionalRole,
    changer: UserAuthInfo,
  ) {
    if (changer.id === userId) {
      throw new BadRequestException(messages.accessScope.cannotPromoteYourself);
    }

    const { admin: adminAccessScope, superAdmin: superAdminAccessScope } =
      await this.getAdminAndSuperAdminAccessScopes();
    const user = await this.userRepo.getOneByIdWithAccessScopes(userId);

    const accessScopes = user.accessScopes.filter(
      (accessScope) =>
        ![AccessScopeType.ADMIN, AccessScopeType.SUPER_ADMIN].includes(
          accessScope.type,
        ),
    );

    switch (additionalRole) {
      case UserAdditionalRole.NONE:
        break;
      case UserAdditionalRole.ADMIN:
        accessScopes.push(adminAccessScope);
        break;
      case UserAdditionalRole.SUPER_ADMIN:
        accessScopes.push(adminAccessScope, superAdminAccessScope);
        break;
    }

    await this.userRepo.updateOneWithRelations({
      id: user.id,
      accessScopes,
    });
  }

  async getAdminAndSuperAdminAccessScopes() {
    const accessScopes =
      await this.accessScopeRepo.getManyAdminAndSuperAdminAccessScopes();
    const adminScopes = accessScopes.filter(
      (accessScope) => accessScope.type === AccessScopeType.ADMIN,
    );
    const superAdminScopes = accessScopes.filter(
      (accessScope) => accessScope.type === AccessScopeType.SUPER_ADMIN,
    );
    if (adminScopes.length !== 1)
      throw new InternalServerErrorException(
        messages.accessScope.notSingleAdminScope,
      );
    if (superAdminScopes.length !== 1)
      throw new InternalServerErrorException(
        messages.accessScope.notSingleSuperAdminScope,
      );
    return {
      admin: adminScopes[0],
      superAdmin: superAdminScopes[0],
    };
  }
}
