import { AuthMessage } from 'src/types';

export interface IEncryptionWorker<
  CredentialsStoredInDB,
  HandshakeCredentialsToBeSentToClient,
  HandshakeCredentialsSentByClient,
> {
  readonly uuid: string;

  // Клиент присылает нам хендшейк по проводу, с указанием что будет
  // использовать конкретный воркер для шифрования
  // Соответсвенно шлюз должен проверить, что с ним всё в порядке
  isClientSideHandshakeCredentialsValid(
    clientSideHandshakeCredentials: HandshakeCredentialsSentByClient,
  ): Promise<boolean>;

  // Когда мы убедились что клиентские креденшалы в порядке,
  // Мы можем сгенерить свои, чтобы отправить их потом на клиент по проводу,
  // а другую часть мы оставим в бд, чтобы расшифровывать последующие сообщения уже по сети
  getServerSideHandshakeCredentials(
    clientSideHandshakeCredentials: HandshakeCredentialsSentByClient,
  ): Promise<{
    credentialsToSendBackToClient: HandshakeCredentialsToBeSentToClient;
    credentialsToStoreInDatabase: CredentialsStoredInDB;
  }>;

  // когда клиент подключается в будущем, он при подключении сообщает кто он
  // и как-то доказывает, что он это он. тут мы в этом убеждаемся
  isAuthRequestFromClientValid(
    credentialsFromDatabase: CredentialsStoredInDB,
    authRequestMessage: AuthMessage,
  ): Promise<boolean>;

  // клиент отправляя сообщения по сети, шифрует их, а мы берём из бд
  // ключи и расшифровываем сообщение
  encryptJsonStringToSendToClient(
    credentialsFromDatabase: CredentialsStoredInDB,
    message: string, // это должна быть построенная json строка
  ): Promise<string>;

  // когда сообщение попало на шлюз мы рассылаем его другим клиентам
  // и для каждого шифруем его способом
  decryptEncryptedJsonStringSentFromClient(
    credentialsFromDatabase: CredentialsStoredInDB,
    encryptedMessage: string, // это должна быть пришедшая зашифрованная json строка
  ): Promise<string>;
}
