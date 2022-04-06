import { isObject } from 'class-validator';
import { IEncryptionWorker } from '../IEncryptionWorker';

export class WithoutEncryptionService
  implements
    IEncryptionWorker<
      Record<string, never>,
      { password: string },
      Record<string, never>
    >
{
  uuid = 'ca4e23ec-f2a4-4d78-aa94-2065d72d5824';

  name = 'worker without real encryption, just for test';

  async getServerSideHandshakeCredentials(
    clientSideHandshakeCredentials: Record<string, never>,
  ) {
    console.log(
      'clientSideHandshakeCredentials: ',
      clientSideHandshakeCredentials,
    );
    return {
      credentialsToSendBackToClient: { password: 'test' },
      credentialsToStoreInDatabase: {},
    };
  }

  async isClientSideHandshakeCredentialsValid(
    clientSideHandshakeCredentials: Record<string, never>,
  ) {
    console.log(
      'clientSideHandshakeCredentials: ',
      clientSideHandshakeCredentials,
    );
    return isObject(clientSideHandshakeCredentials);
  }

  async encryptJsonStringToSendToClient(
    credentialsFromDatabase: Record<string, never>,
    message: string,
  ) {
    console.log('credentialsFromDatabase: ', credentialsFromDatabase);
    return `((((((${message}))))))`;
  }

  async decryptEncryptedJsonStringSentFromClient(
    credentialsFromDatabase: Record<string, never>,
    encryptedMessage: string,
  ) {
    console.log('credentialsFromDatabase: ', credentialsFromDatabase);
    // messages from client should be [[[{"asd":123}]]]
    return encryptedMessage.slice(3, -3);
  }

  async isAuthRequestFromClientValid(
    credentialsFromDatabase: Record<string, never>,
    authRequestMessage: Record<string, any>,
  ) {
    if (authRequestMessage.password === 'test') return true;
  }
}
