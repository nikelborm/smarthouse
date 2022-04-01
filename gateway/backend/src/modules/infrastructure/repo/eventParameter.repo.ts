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
import { EventParameter } from '../model';

@Injectable()
export class EventParameterRepo {
  constructor(
    @InjectRepository(EventParameter)
    private readonly repo: Repository<EventParameter>,
  ) {}

  getAll() {
    return this.repo.find();
  }

  async getOneById(id: number) {
    const eventParameter = await this.repo.findOne({
      where: { id },
    });
    if (!eventParameter)
      throw new BadRequestException(
        messages.repo.common.cantGetNotFoundById('eventParameter', id),
      );
    return eventParameter;
  }

  createOneWithRelations(newEventParameter: NewEntity<EventParameter>) {
    return createOneWithRelations(
      this.repo,
      newEventParameter,
      'eventParameter',
    );
  }

  createManyWithRelations(newEventParameters: NewEntity<EventParameter>[]) {
    return createManyWithRelations(
      this.repo,
      newEventParameters,
      'eventParameter',
    );
  }

  updateOnePlain(id: number, updated: PlainEntityWithoutId<EventParameter>) {
    return updateOnePlain(this.repo, id, updated, 'eventParameter');
  }

  updateOneWithRelations(newEventParameter: UpdatedEntity<EventParameter>) {
    return updateOneWithRelations(
      this.repo,
      newEventParameter,
      'eventParameter',
    );
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
