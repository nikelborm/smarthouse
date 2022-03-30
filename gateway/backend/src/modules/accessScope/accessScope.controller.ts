import { Body, Controller, Post, Req, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessScopeUseCase } from './accessScope.useCase';
import { EmptyResponseDTO, SetAdditionalRoleToUserDTO } from 'src/types';
import { AuthedRequest, SuperAdminOnly } from '../auth';

@ApiTags('accessScope')
@Controller('/api')
export class AccessScopeController {
  constructor(private readonly accessScopeUseCase: AccessScopeUseCase) {}

  @Post('/setAdditionalRoleToUser')
  @SuperAdminOnly()
  async setAdditionalRoleToUser(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    { userId, additionalRole }: SetAdditionalRoleToUserDTO,
    @Req() { user }: AuthedRequest,
  ): Promise<EmptyResponseDTO> {
    await this.accessScopeUseCase.setAdditionalRoleToUser(
      userId,
      additionalRole,
      user,
    );
    return { response: {} };
  }
}
