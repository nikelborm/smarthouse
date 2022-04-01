import { Module } from '@nestjs/common';
import { HandshakeUseCase } from './handshake.useCase';

@Module({
  providers: [HandshakeUseCase],
  exports: [HandshakeUseCase],
})
export class HandshakeModule {}
