import { Injectable } from '@nestjs/common';
import { repo } from '../infrastructure';

@Injectable()
export class GatewayEndpointsUseCase {
  constructor(private readonly routeRepo: repo.RouteRepo) {}
}
