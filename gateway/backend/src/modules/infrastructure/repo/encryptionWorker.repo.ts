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
import { EntityManager, Repository } from 'typeorm';
import { Client, EncryptionWorker } from '../model';

@Injectable()
export class EncryptionWorkerRepo {
  constructor(
    @InjectRepository(EncryptionWorker)
    private readonly repo: Repository<EncryptionWorker>,
  ) {}

  getAll() {
    return this.repo.find();
  }

  async getInTransactionOneByUUID(
    uuid: string,
    transactionManager: EntityManager,
  ) {
    return this._getOneByUUID(
      uuid,
      transactionManager.getRepository(EncryptionWorker),
    );
  }

  async getOneByUUID(uuid: string) {
    return this._getOneByUUID(uuid);
  }

  private async _getOneByUUID(
    uuid: string,
    overrideRepo?: Repository<EncryptionWorker>,
  ) {
    const encryptionWorker = await (overrideRepo || this.repo).findOne({
      where: { uuid },
    });
    if (!encryptionWorker)
      throw new BadRequestException(
        messages.repo.common.cantGetNotFoundByUUID('encryptionWorker', uuid),
      );
    return encryptionWorker;
  }

  createManyWithRelations(newEncryptionWorkers: NewEncryptionWorker[]) {
    return createManyWithRelations<any>(
      this.repo,
      newEncryptionWorkers,
      'encryptionWorker',
    );
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}

type NewEncryptionWorker = {
  uuid: string;
  name: string;
  clients: Client[];
};

type UpdateDataValidatorPlain = {
  uuid: string;
  name?: string;
};

type UpdateDataValidatorWithRelations = {
  uuid: string;
  name?: string;
  eventParameters?: Client[];
};
