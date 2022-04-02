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
import { EncryptionWorker } from '../model';

@Injectable()
export class EncryptionWorkerRepo {
  constructor(
    @InjectRepository(EncryptionWorker)
    private readonly repo: Repository<EncryptionWorker>,
  ) {}

  getAll() {
    return this.repo.find();
  }

  async getOneById(id: number) {
    const encryptionWorker = await this.repo.findOne({
      where: { id },
    });
    if (!encryptionWorker)
      throw new BadRequestException(
        messages.repo.common.cantGetNotFoundById('encryptionWorker', id),
      );
    return encryptionWorker;
  }

  createManyWithRelations(newEncryptionWorkers: NewEntity<EncryptionWorker>[]) {
    return createManyWithRelations(
      this.repo,
      newEncryptionWorkers,
      'encryptionWorker',
    );
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
