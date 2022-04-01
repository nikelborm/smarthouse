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
import { EncryptionModule } from '../model';

@Injectable()
export class EncryptionModuleRepo {
  constructor(
    @InjectRepository(EncryptionModule)
    private readonly repo: Repository<EncryptionModule>,
  ) {}

  getAll() {
    return this.repo.find();
  }

  async getOneById(id: number) {
    const encryptionModule = await this.repo.findOne({
      where: { id },
    });
    if (!encryptionModule)
      throw new BadRequestException(
        messages.repo.common.cantGetNotFoundById('encryptionModule', id),
      );
    return encryptionModule;
  }

  createOneWithRelations(newEncryptionModule: NewEntity<EncryptionModule>) {
    return createOneWithRelations(
      this.repo,
      newEncryptionModule,
      'encryptionModule',
    );
  }

  createManyWithRelations(newEncryptionModules: NewEntity<EncryptionModule>[]) {
    return createManyWithRelations(
      this.repo,
      newEncryptionModules,
      'encryptionModule',
    );
  }

  updateOnePlain(id: number, updated: PlainEntityWithoutId<EncryptionModule>) {
    return updateOnePlain(this.repo, id, updated, 'encryptionModule');
  }

  updateOneWithRelations(newEncryptionModule: UpdatedEntity<EncryptionModule>) {
    return updateOneWithRelations(
      this.repo,
      newEncryptionModule,
      'encryptionModule',
    );
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
