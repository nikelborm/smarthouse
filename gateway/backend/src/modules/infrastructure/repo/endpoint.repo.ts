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
import { Endpoint } from '../model';

@Injectable()
export class EndpointRepo {
  constructor(
    @InjectRepository(Endpoint)
    private readonly repo: Repository<Endpoint>,
  ) {}

  getAll() {
    return this.repo.find();
  }

  async getOneById(id: number) {
    const endpoint = await this.repo.findOne({
      where: { id },
    });
    if (!endpoint)
      throw new BadRequestException(
        messages.repo.common.cantGetNotFoundById('endpoint', id),
      );
    return endpoint;
  }

  createOneWithRelations(newEndpoint: NewEntity<Endpoint>) {
    return createOneWithRelations(this.repo, newEndpoint, 'endpoint');
  }

  createManyWithRelations(newEndpoints: NewEntity<Endpoint>[]) {
    return createManyWithRelations(this.repo, newEndpoints, 'endpoint');
  }

  updateOnePlain(id: number, updated: PlainEntityWithoutId<Endpoint>) {
    return updateOnePlain(this.repo, id, updated, 'endpoint');
  }

  updateOneWithRelations(newEndpoint: UpdatedEntity<Endpoint>) {
    return updateOneWithRelations(this.repo, newEndpoint, 'endpoint');
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
