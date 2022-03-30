import { Injectable } from '@nestjs/common';

import { repo } from 'src/modules/infrastructure';
import { UserUseCase } from 'src/modules/user';

@Injectable()
export class MockDataUseCase {
  constructor(
    private readonly userRepo: repo.UserRepo,
    private readonly userUseCase: UserUseCase,
  ) {}

  async fillDBScript() {
    console.log(
      '🚀 ~ file: mockData.useCase.ts ~ line 13 ~ MockDataUseCase ~ fillDBScript ~ asd',
    );
  }
}
