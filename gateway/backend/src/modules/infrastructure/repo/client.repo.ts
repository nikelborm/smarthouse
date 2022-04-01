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
import { Client } from '../model';

@Injectable()
export class ClientRepo {
  constructor(
    @InjectRepository(Client)
    private readonly repo: Repository<Client>,
  ) {}

  getAll() {
    return this.repo.find();
  }

  async getOneById(id: number) {
    const client = await this.repo.findOne({
      where: { id },
    });
    if (!client)
      throw new BadRequestException(
        messages.repo.common.cantGetNotFoundById('client', id),
      );
    return client;
  }

  createOneWithRelations(newClient: NewEntity<Client>) {
    return createOneWithRelations(this.repo, newClient, 'client');
  }

  createManyWithRelations(newClients: NewEntity<Client>[]) {
    return createManyWithRelations(this.repo, newClients, 'client');
  }

  updateOnePlain(id: number, updated: PlainEntityWithoutId<Client>) {
    return updateOnePlain(this.repo, id, updated, 'client');
  }

  updateOneWithRelations(newClient: UpdatedEntity<Client>) {
    return updateOneWithRelations(this.repo, newClient, 'client');
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
