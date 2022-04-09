import { ConfigService } from '@nestjs/config';
import { repo } from '../infrastructure';

export const GATEWAY_AS_CLIENT_INITIALIZER_KEY = Symbol(
  'gatewayAsClientInitializerKey',
);

export const GatewayAsClientInitializer = {
  provide: GATEWAY_AS_CLIENT_INITIALIZER_KEY,
  useFactory: async (
    endpointRepo: repo.EndpointRepo,
    configService: ConfigService,
  ) => {
    const endopintUUIDsRegisteredInDB = (
      await endpointRepo.getManyWithOnlyUUIDsByClientUUID(
        configService.get('gatewayUUID'),
      )
    ).map(({ uuid }) => uuid);

    console.log('endopintUUIDsRegisteredInDB: ', endopintUUIDsRegisteredInDB);
    return endopintUUIDsRegisteredInDB;
  },
  inject: [repo.EndpointRepo, ConfigService],
};
