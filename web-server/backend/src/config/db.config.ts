import { registerAs } from '@nestjs/config';
import { dataSourceConfig } from './databaseConnectionOptions';

export const dbConfig = registerAs('database', () => ({
  type: dataSourceConfig.type,
  host: dataSourceConfig.host,
  port: dataSourceConfig.port,
  username: dataSourceConfig.username,
  password: dataSourceConfig.password,
  name: dataSourceConfig.database,
  migrationsTableName: dataSourceConfig.migrationsTableName,
  entities: dataSourceConfig.entities,
  typeormLoggingMode: dataSourceConfig.logging,
}));
