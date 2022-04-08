import { DataValidatorUseCase } from '../dataValidator';
import { EncryptionUseCase } from '../encryption';

export const GATEWAY_AS_CLIENT_INITIALIZER_KEY = Symbol(
  'gatewayAsClientInitializerKey',
);

export const GatewayAsClientInitializer = {
  provide: GATEWAY_AS_CLIENT_INITIALIZER_KEY,
  useFactory: async () => {
    console.log('GatewayAsClientInitializer factory');
  },
  inject: [EncryptionUseCase, DataValidatorUseCase],
};
