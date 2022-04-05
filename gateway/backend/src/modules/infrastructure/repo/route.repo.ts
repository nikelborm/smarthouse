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
import { Route } from '../model';

@Injectable()
export class RouteRepo {
  constructor(
    @InjectRepository(Route)
    private readonly repo: Repository<Route>,
  ) {}

  getAll() {
    return this.repo.find();
  }

  async getOneById(id: number) {
    const route = await this.repo.findOne({
      where: { id },
    });
    if (!route)
      throw new BadRequestException(
        messages.repo.common.cantGetNotFoundById('route', id),
      );
    return route;
  }

  async getManyRoutesBySource(endpointId: number) {
    const routes = await this.repo.find({
      where: { sourceEndpointId: endpointId },
      select: {
        sinkEndpoint: {
          uuid: true,
          clientId: true,
        },
      },
      relations: {
        sinkEndpoint: true,
      },
    });
    return routes;
  }

  createOneWithRelations(newRoute: NewEntity<Route>) {
    return createOneWithRelations(this.repo, newRoute, 'route');
  }

  createManyWithRelations(newRoutes: NewEntity<Route>[]) {
    return createManyWithRelations(this.repo, newRoutes, 'route');
  }

  updateOnePlain(id: number, updated: PlainEntityWithoutId<Route>) {
    return updateOnePlain(this.repo, id, updated, 'route');
  }

  updateOneWithRelations(newRoute: UpdatedEntity<Route>) {
    return updateOneWithRelations(this.repo, newRoute, 'route');
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
