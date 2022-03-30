import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserUseCase } from './user.useCase';
import {
  CreateUserDTO,
  CreateUsersDTO,
  DeleteEntityByIdDTO,
  EmptyResponseDTO,
  FindManyUsersResponseDTO,
  CreateOneUserResponse,
  CreateManyUsersResponseDTO,
  SetMyPasswordDTO,
} from 'src/types';
import {
  AuthedRequest,
  AuthorizedOnly,
  Role,
  Roles,
  SuperAdminOnly,
} from '../auth';

@ApiTags('user')
@Controller('/api')
export class UserController {
  constructor(private readonly userUseCase: UserUseCase) {}

  @Get('/users')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findManyUsers(
    @Query('search') search?: string,
  ): Promise<FindManyUsersResponseDTO> {
    const users = await this.userUseCase.findManyWithAdditionalRole(search);
    return {
      response: {
        users,
      },
    };
  }

  @Post('/createUser')
  async createUser(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    { firstName, lastName, email, password }: CreateUserDTO,
  ): Promise<CreateOneUserResponse> {
    const user = await this.userUseCase.createUser({
      firstName,
      lastName,
      email,
      password,
      accessScopes: [],
    });
    return {
      response: {
        user,
      },
    };
  }

  @Post('/createUsers')
  @SuperAdminOnly()
  async createUsers(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    { users }: CreateUsersDTO,
  ): Promise<CreateManyUsersResponseDTO> {
    const userModels = await this.userUseCase.createManyUsers(users);
    return {
      response: {
        users: userModels,
      },
    };
  }

  @Post('/setMyPassword')
  @AuthorizedOnly()
  async setMyPassword(
    @Req() { user }: AuthedRequest,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    { password }: SetMyPasswordDTO,
  ): Promise<EmptyResponseDTO> {
    await this.userUseCase.setUserPassword(user.id, password);
    return { response: {} };
  }

  @Post('/deleteUserById')
  @SuperAdminOnly()
  async deleteUser(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    { id }: DeleteEntityByIdDTO,
  ): Promise<EmptyResponseDTO> {
    await this.userUseCase.deleteOne(id);
    return { response: {} };
  }
}
