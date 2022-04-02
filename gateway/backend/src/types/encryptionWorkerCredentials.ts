export type EncryptionWorkerCredentialsStoredInDB =
  IAssymerticEncryptionCredentialsStoredInDB;

interface IAssymerticEncryptionCredentialsStoredInDB {
  // когда клиент пытается зарегаться, он сообщает нам ключ,
  // которым мы должны шифровать сообщения посылаемые на него,
  // и только он сможет их прочитать как обладатель своего приватного ключа, который хранится на нём
  clientPublicKeyToEncryptOutcoming: string;

  // когда клиент сказал нам кто он, мы кидаем ему свой публичный ключ сгенерированный специально для него,
  // которым он должен шифровать свои сообщения посылаемые на шлюз,
  // чтобы только шлюз мог используя это поле расшифровать)
  clientPrivateKeyToDecryptIncoming: string;
}

export interface IAssymerticHandshakeCredentialsSentByClient {
  clientPublicKey: string;
  clientUUIDSignedByClientPrivateKey: string;
}

export interface IAssymerticHandshakeCredentialsToBeSentToClient {
  publicKey: string;
  gatewayUUIDSignedByGatewayPrivateKey: string;
}
