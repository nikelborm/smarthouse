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
import { DataValidator, EventParameter } from '../model';

@Injectable()
export class DataValidatorRepo {
  constructor(
    @InjectRepository(DataValidator)
    private readonly repo: Repository<DataValidator>,
  ) {}

  getAll() {
    return this.repo.find();
  }

  async getOneByUUID(uuid: string) {
    const dataValidator = await this.repo.findOne({
      where: { uuid },
    });
    if (!dataValidator)
      throw new BadRequestException(
        messages.repo.common.cantGetNotFoundByUUID('dataValidator', uuid),
      );
    return dataValidator;
  }

  createOneWithRelations(newDataValidator: NewDataValidator) {
    return createOneWithRelations<any>(
      this.repo,
      newDataValidator,
      'dataValidator',
    );
  }

  createManyWithRelations(newDataValidators: NewDataValidator[]) {
    return createManyWithRelations<any>(
      this.repo,
      newDataValidators,
      'dataValidator',
    );
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}

type NewDataValidator = {
  uuid: string;
  name: string;
  eventParameters?: EventParameter[];
};
