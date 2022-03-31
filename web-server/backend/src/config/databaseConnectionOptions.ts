import { LoggerOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const dataSourceConfig: PostgresConnectionOptions = {
  type: 'postgres' as const,
  host: '172.17.0.3',
  port: 5500,
  username: 'smarthouse_webserver_pgdocker',
  password: 'smarthouse_webserver_pgdocker',
  database: 'smarthouse_webserver_pgdocker',
  synchronize: false,
  migrationsTableName: void 0,
  migrationsRun: void 0,
  logging: 'all' as LoggerOptions,
  entities: ['dist/modules/infrastructure/model/*.model.js'],
  migrations: ['dist/modules/infrastructure/migration/*.js'],
};
