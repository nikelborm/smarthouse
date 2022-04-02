import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientInitialHandshakeUseCase {
  init(...args) {
    console.log(
      '🚀 ~ file: clientInitialHandshake.useCase.ts ~ line 9 ~ ClientInitialHandshakeUseCase ~ init ~ args',
      args,
    );
  }
}
