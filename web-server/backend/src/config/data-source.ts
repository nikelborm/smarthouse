import { DataSource } from 'typeorm';
import { dataSourceConfig } from './databaseConnectionOptions';

export const AppDataSource = new DataSource(dataSourceConfig);
