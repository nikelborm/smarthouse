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
import { ParameterToEventAssociation } from '../model';

@Injectable()
export class ParameterToEventAssociationRepo {
  constructor(
    @InjectRepository(ParameterToEventAssociation)
    private readonly repo: Repository<ParameterToEventAssociation>,
  ) {}

  getAll() {
    return this.repo.find();
  }

  async getOneById(id: number) {
    const parameterToEventAssociation = await this.repo.findOne({
      where: { id },
    });
    if (!parameterToEventAssociation)
      throw new BadRequestException(
        messages.repo.common.cantGetNotFoundById(
          'parameterToEventAssociation',
          id,
        ),
      );
    return parameterToEventAssociation;
  }

  createOneWithRelations(
    newParameterToEventAssociation: NewEntity<ParameterToEventAssociation>,
  ) {
    return createOneWithRelations(
      this.repo,
      newParameterToEventAssociation,
      'parameterToEventAssociation',
    );
  }

  createManyWithRelations(
    newParameterToEventAssociations: NewEntity<ParameterToEventAssociation>[],
  ) {
    return createManyWithRelations(
      this.repo,
      newParameterToEventAssociations,
      'parameterToEventAssociation',
    );
  }

  updateOnePlain(
    id: number,
    updated: PlainEntityWithoutId<ParameterToEventAssociation>,
  ) {
    return updateOnePlain(
      this.repo,
      id,
      updated,
      'parameterToEventAssociation',
    );
  }

  updateOneWithRelations(
    newParameterToEventAssociation: UpdatedEntity<ParameterToEventAssociation>,
  ) {
    return updateOneWithRelations(
      this.repo,
      newParameterToEventAssociation,
      'parameterToEventAssociation',
    );
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
