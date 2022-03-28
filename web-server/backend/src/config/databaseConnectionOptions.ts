import { LoggerOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const dataSourceConfig: PostgresConnectionOptions = {
  type: 'postgres' as const,
  host: 'localhost',
  port: 5433,
  username: 'smarthouse',
  password: 'smarthouse',
  database: 'smarthouse',
  synchronize: false,
  migrationsTableName: void 0,
  migrationsRun: void 0,
  logging: 'all' as LoggerOptions,
  entities: ['dist/modules/infrastructure/model/*.model.js'],
  migrations: ['dist/modules/infrastructure/migration/*.js'],
};
