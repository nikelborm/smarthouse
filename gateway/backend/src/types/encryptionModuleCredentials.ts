interface AsymmetricEncryptionCredenentials {
  // когда клиент пытается зарегаться, он сообщает нам ключ,
  // которым мы должны шифровать сообщения посылаемые на него,
  // и только он сможет их прочитать как обладатель своего приватного ключа, который хранится на нём
  client_public_key_to_encrypt_outcoming: string;

  // когда клиент сказал нам кто он, мы кидаем ему свой публичный ключ сгенерированный специально для него,
  // которым он должен шифровать свои сообщения посылаемые на шлюз,
  // чтобы только шлюз мог используя это поле расшифровать)
  client_private_key_to_decrypt_incoming: string;
}

export type EncryptionModuleCredentials = AsymmetricEncryptionCredenentials;
