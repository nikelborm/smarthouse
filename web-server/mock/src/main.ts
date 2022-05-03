import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { MockDataUseCase } from './mockData.useCase';
import { logConfig } from 'src/tools';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  logConfig(configService);
  if (process.argv.includes('listen')) {
    await app.listen(configService.get('serverPort') as number);
  } else {
    const mockUseCase = app.get(MockDataUseCase);
    const scriptName = configService.get('mockDataFillerScriptMethodName');
    if (!scriptName || !(scriptName in mockUseCase))
      throw new Error(`Script with name '${scriptName}' not found`);
    console.log(`\n\n\nfilling started: ${scriptName}\n`);
    await mockUseCase[scriptName]();
    console.log('DATABASE FILLED SUCCESSFULLY\n\n\n');
    process.exit(0);
  }
}
bootstrap();
