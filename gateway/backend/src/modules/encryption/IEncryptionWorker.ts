import { WSMessage } from 'src/types';

export interface IEncryptionWorker<
  CredentialsStoredInDB,
  HandshakeCredentialsToBeSentToClient,
  HandshakeCredentialsSentByClient,
> {
  readonly uuid: string;

  validateClientSideHandshakeCredentials(
    clientSideHandshakeCredentials: HandshakeCredentialsSentByClient,
  ): boolean;

  getServerSideHandshakeCredentials(
    clientSideHandshakeCredentials: HandshakeCredentialsSentByClient,
  ): {
    credentialsToSendBackToClient: HandshakeCredentialsToBeSentToClient;
    credentialsToStoreInDatabase: CredentialsStoredInDB;
  };

  encryptMessageToSendToClient(
    credentialsFromDatabase: CredentialsStoredInDB,
    message: WSMessage,
  ): string;

  decryptMessageSentFromClient(
    credentialsFromDatabase: CredentialsStoredInDB,
    encryptedMessage: string,
  ): WSMessage;
}
