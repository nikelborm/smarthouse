import { IEncryptionWorker } from '../IEncryptionWorker';

export class WithoutEncryptionService
  implements
    IEncryptionWorker<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>
    >
{
  uuid = 'ca4e23ec-f2a4-4d78-aa94-2065d72d5824';

  async getServerSideHandshakeCredentials(
    clientSideHandshakeCredentials: Record<string, never>,
  ) {
    return {
      credentialsToSendBackToClient: {},
      credentialsToStoreInDatabase: {},
    };
  }

  async validateClientSideHandshakeCredentials(
    clientSideHandshakeCredentials: Record<string, never>,
  ) {
    return true;
  }

  async encryptJsonStringToSendToClient(
    credentialsFromDatabase: Record<string, never>,
    message: string,
  ) {
    return JSON.stringify(message);
  }

  async decryptEncryptedJsonStringSentFromClient(
    credentialsFromDatabase: Record<string, never>,
    encryptedMessage: string,
  ) {
    return JSON.parse(encryptedMessage);
  }

  async validateAuthRequestFromClient(
    credentialsFromDatabase: Record<string, never>,
    authRequestMessage: Record<string, any>,
  ) {
    return true;
  }
}
