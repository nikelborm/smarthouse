import { BadRequestException } from '@nestjs/common';
import { messages } from 'src/config';
import { Repository } from 'typeorm';
import { EntityWithId, UpdatedEntity, getNotExistingEntityIds } from '.';
import { validateExistingId } from '..';

export async function updateManyWithRelations<T extends EntityWithId>(
  repo: Repository<T & { id: number }>,
  updatedEntities: UpdatedEntity<T>[],
  entityName?: string,
  config?: { chunk?: number; disableExistingCheck?: boolean },
): Promise<T[]> {
  validateExistingId({
    entities: updatedEntities,
    shouldIdExist: true,
    errorText: messages.repo.common.cantUpdateWithoutIds(
      entityName,
      updatedEntities,
    ),
  });

  // TODO: Сделать возможность убрать проверку на существование сущностей
  const { entityIdsToCheck: wantedToUpdateEntityIds, notExistingEntityIds } =
    await getNotExistingEntityIds(repo, updatedEntities);

  if (notExistingEntityIds.length)
    throw new BadRequestException(
      messages.repo.common.cantUpdateManyNotFound(
        entityName,
        wantedToUpdateEntityIds,
        notExistingEntityIds,
      ),
    );

  //@ts-expect-error asd
  return repo.save(updatedEntities, {
    chunk: config?.chunk,
  });
}
