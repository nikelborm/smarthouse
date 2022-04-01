import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { messages } from 'src/config';
import {
  createManyWithRelations,
  createOneWithRelations,
  NewEntity,
  PlainEntityWithoutId,
  UpdatedEntity,
  updateOnePlain,
  updateOneWithRelations,
} from 'src/tools';
import { Repository } from 'typeorm';
import { DataValidator } from '../model';

@Injectable()
export class DataValidatorRepo {
  constructor(
    @InjectRepository(DataValidator)
    private readonly repo: Repository<DataValidator>,
  ) {}

  getAll() {
    return this.repo.find();
  }

  async getOneById(id: number) {
    const dataValidator = await this.repo.findOne({
      where: { id },
    });
    if (!dataValidator)
      throw new BadRequestException(
        messages.repo.common.cantGetNotFoundById('dataValidator', id),
      );
    return dataValidator;
  }

  createOneWithRelations(newDataValidator: NewEntity<DataValidator>) {
    return createOneWithRelations(this.repo, newDataValidator, 'dataValidator');
  }

  createManyWithRelations(newDataValidators: NewEntity<DataValidator>[]) {
    return createManyWithRelations(
      this.repo,
      newDataValidators,
      'dataValidator',
    );
  }

  updateOnePlain(id: number, updated: PlainEntityWithoutId<DataValidator>) {
    return updateOnePlain(this.repo, id, updated, 'dataValidator');
  }

  updateOneWithRelations(newDataValidator: UpdatedEntity<DataValidator>) {
    return updateOneWithRelations(this.repo, newDataValidator, 'dataValidator');
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
