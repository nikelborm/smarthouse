import { LoggerOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const dataSourceConfig: PostgresConnectionOptions = {
  type: 'postgres' as const,
  host: '172.17.0.2',
  port: 5501,
  username: 'smarthouse_gateway_pgdocker',
  password: 'smarthouse_gateway_pgdocker',
  database: 'smarthouse_gateway_pgdocker',
  synchronize: false,
  migrationsTableName: void 0,
  migrationsRun: void 0,
  logging: 'all' as LoggerOptions,
  entities: ['dist/modules/infrastructure/model/*.model.js'],
  migrations: ['dist/modules/infrastructure/migration/*.js'],
};
