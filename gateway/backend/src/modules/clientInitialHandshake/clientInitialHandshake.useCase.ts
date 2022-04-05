import { Injectable } from '@nestjs/common';
import { InitHandshakeQuery, InitHandshakeResponse } from 'src/types';

@Injectable()
export class ClientInitialHandshakeUseCase {
  async init(
    handshakeRequest: InitHandshakeQuery,
  ): Promise<InitHandshakeResponse> {
    console.log(
      '🚀 ~ file: clientInitialHandshake.useCase.ts ~ line 9 ~ ClientInitialHandshakeUseCase ~ init ~ args',
      handshakeRequest,
    );
    return {
      registeredClientId: 123,
      wifi: {
        BSSID: '00:00:5e:00:53:af',
        password: 'shit',
      },
      gateway: {
        HTTPAdress: 'https://asd.ri',
        UUID: '234',
        WSAdress: 'ws://123.234.345.456/socket',
        encryptionModuleCredentials: {
          password: 'test',
        },
      },
    };
  }
}
