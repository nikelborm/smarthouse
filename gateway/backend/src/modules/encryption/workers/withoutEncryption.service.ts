import { WSMessage } from 'src/types';
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

  getServerSideHandshakeCredentials(
    clientSideHandshakeCredentials: Record<string, never>,
  ): {
    credentialsToSendBackToClient: Record<string, never>;
    credentialsToStoreInDatabase: Record<string, never>;
  } {
    return {
      credentialsToSendBackToClient: {},
      credentialsToStoreInDatabase: {},
    };
  }

  validateClientSideHandshakeCredentials(
    clientSideHandshakeCredentials: Record<string, never>,
  ): boolean {
    return true;
  }

  encryptMessageToSendToClient(
    credentialsFromDatabase: Record<string, never>,
    message: WSMessage,
  ): string {
    return JSON.stringify(message);
  }

  decryptMessageSentFromClient(
    credentialsFromDatabase: Record<string, never>,
    encryptedMessage: string,
  ): WSMessage {
    return JSON.parse(encryptedMessage);
  }
}
