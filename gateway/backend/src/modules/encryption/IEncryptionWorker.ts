export interface IEncryptionWorker<
  CredentialsStoredInDB,
  Message,
  HandshakeCredentialsToBeSentToClient,
  HandshakeCredentialsSentByClient,
> {
  validateClientSideHandshakeCredentials(
    clientSideHandshakeCredentials: HandshakeCredentialsSentByClient,
  ): boolean;

  getServerSideHandshakeCredentials(): {
    credentialsToSendBackToClient: HandshakeCredentialsToBeSentToClient;
    credentialsToStoreInDatabase: CredentialsStoredInDB;
  };

  encryptMessageToSendToClient(
    credentialsFromDatabase: CredentialsStoredInDB,
    message: Message,
  ): string;

  decryptMessageSentFromClient(
    credentialsFromDatabase: CredentialsStoredInDB,
    encryptedMessage: string,
  ): Message;
}
