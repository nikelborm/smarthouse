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

  async getOneWithInfoAboutSupportedStuffBy(uuid: string) {
    console.log(
      '🚀 ~ file: client.repo.ts ~ line 87 ~ ClientRepo ~ getOneWithInfoAboutSupportedStuffBy ~ client',
      uuid,
    );
    const client = await this.repo.findOne({
      where: { uuid },
      select: {
        id: true,
        encryptionWorker: {
          uuid: true,
        },
        endpoints: {
          id: true,
          uuid: true,
          type: true,
          event: {
            id: true,
            uuid: true,
            type: true,
            parameterAssociations: {
              eventParameter: {
                id: true,
                uuid: true,
                dataValidator: {
                  uuid: true,
                },
              },
              isParameterRequired: true,
            },
          },
        },
      },
      relations: {
        encryptionWorker: true,
        endpoints: {
          event: {
            parameterAssociations: {
              eventParameter: {
                dataValidator: true,
              },
            },
          },
        },
      },
    });
    if (!client)
      throw new BadRequestException(
        messages.repo.common.cantGetNotFoundByUUID('client', uuid),
      );
    client.uuid = uuid;
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
