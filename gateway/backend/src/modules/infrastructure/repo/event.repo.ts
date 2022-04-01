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
import { Event } from '../model';

@Injectable()
export class EventRepo {
  constructor(
    @InjectRepository(Event)
    private readonly repo: Repository<Event>,
  ) {}

  getAll() {
    return this.repo.find();
  }

  async getOneById(id: number) {
    const event = await this.repo.findOne({
      where: { id },
    });
    if (!event)
      throw new BadRequestException(
        messages.repo.common.cantGetNotFoundById('event', id),
      );
    return event;
  }

  createOneWithRelations(newEvent: NewEntity<Event>) {
    return createOneWithRelations(this.repo, newEvent, 'event');
  }

  createManyWithRelations(newEvents: NewEntity<Event>[]) {
    return createManyWithRelations(this.repo, newEvents, 'event');
  }

  updateOnePlain(id: number, updated: PlainEntityWithoutId<Event>) {
    return updateOnePlain(this.repo, id, updated, 'event');
  }

  updateOneWithRelations(newEvent: UpdatedEntity<Event>) {
    return updateOneWithRelations(this.repo, newEvent, 'event');
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
