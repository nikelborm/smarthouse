import { Injectable } from '@nestjs/common';

import { repo } from 'src/modules/infrastructure';

@Injectable()
export class MockDataUseCase {
  constructor(
    private readonly routeRepo: repo.RouteRepo,
  ) {}

  async fillDBScript() {
    console.log(
      '🚀 ~ file: mockData.useCase.ts ~ line 13 ~ MockDataUseCase ~ fillDBScript ~ asd',
    );
  }
}
