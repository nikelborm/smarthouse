import { Injectable } from '@nestjs/common';
import { repo } from '../infrastructure';

@Injectable()
export class RouteUseCase {
  constructor(private readonly routeRepo: repo.RouteRepo) {}
}
