import { Injectable } from '@nestjs/common';
import { repo } from '../infrastructure';

@Injectable()
export class ClientManagementUseCase {
  constructor(private readonly routeRepo: repo.RouteRepo) {}
}
