import { Module } from '@nestjs/common';
import { ClientManagementUseCase } from './clientManagement.useCase';

@Module({
  providers: [ClientManagementUseCase],
  exports: [ClientManagementUseCase],
})
export class ClientManagementModule {}
