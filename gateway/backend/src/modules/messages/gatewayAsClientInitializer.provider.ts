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
    const endpointUUIDsRegisteredInDB = (
      await endpointRepo.getManyWithOnlyUUIDsByClientUUID(
        configService.get('gatewayUUID') as string,
      )
    ).map(({ uuid }) => uuid);

    console.log('endopintUUIDsRegisteredInDB: ', endpointUUIDsRegisteredInDB);
    return endpointUUIDsRegisteredInDB;
  },
  inject: [repo.EndpointRepo, ConfigService],
};
