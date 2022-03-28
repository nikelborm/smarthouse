import { BadRequestException, Injectable } from '@nestjs/common';
import { model, repo } from '../infrastructure';
import { createHash, randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { AccessScopeType, UserAdditionalRole } from 'src/types';
import { messages } from 'src/config';

@Injectable()
export class UserUseCase {
  constructor(
    private readonly userRepo: repo.UserRepo,
    private readonly configService: ConfigService,
  ) {}

  getOneById(id: number) {
    return this.userRepo.getOneById(id);
  }

  getOneByName(name: { firstName: string; lastName: string }) {
    return this.userRepo.findOneByName(name.firstName, name.lastName);
  }

  deleteOne(id: number) {
    return this.userRepo.delete(id);
  }

  async findManyWithAdditionalRole(search?: string) {
    const users = await this.userRepo.findManyWithAccessScopes(search);

    return users.map(({ accessScopes, ...other }) => {
      const addionalRoles = new Set(accessScopes.map(({ type }) => type));

      const getAdditionalRole = () => {
        if (addionalRoles.has(AccessScopeType.SUPER_ADMIN))
          return UserAdditionalRole.SUPER_ADMIN;
        if (addionalRoles.has(AccessScopeType.ADMIN))
          return UserAdditionalRole.ADMIN;
        return UserAdditionalRole.NONE;
      };

      return {
        ...other,
        addionalRole: getAdditionalRole(),
        accessScopes,
      };
    });
  }

  createManyUsers(users: InputUser[]) {
    return this.userRepo.createManyWithRelations(
      users.map((user) => this.createUserModel(user)),
    );
  }

  async createUser(user: InputUser) {
    const candidate = await this.userRepo.getOneByEmail(user.email);
    if (candidate) throw new BadRequestException(messages.user.exists);
    return await this.userRepo.createOneWithRelations(
      this.createUserModel(user),
    );
  }

  async setUserPassword(id: number, password: string) {
    const candidate = await this.userRepo.getOneById(id);
    if (!candidate)
      throw new BadRequestException(messages.user.missingUpdatedInFound);
    const updatedUser = this.createUserModel({ ...candidate, password });
    return this.userRepo.updateOnePlain(id, updatedUser);
  }

  private createUserModel({ password, ...rest }: InputUser) {
    const salt = randomBytes(64).toString('hex');
    return {
      ...rest,
      salt,
      passwordHash: createHash('sha256')
        .update(salt)
        .update(password)
        .update(this.configService.get('userPasswordHashSalt'))
        .digest('hex'),
    };
  }
}

interface InputUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accessScopes?: model.AccessScope[];
}
