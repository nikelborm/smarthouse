import { Controller, Get } from '@nestjs/common';
import { MockDataUseCase } from './mockData.useCase';

@Controller('/')
export class MockDataController {
  constructor(private readonly mockDataUseCase: MockDataUseCase) {}

  @Get('/fill')
  async fillDB() {
    await this.mockDataUseCase.fillDBScript();
    return { response: {} };
  }
}
