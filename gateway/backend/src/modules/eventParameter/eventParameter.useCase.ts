import { Injectable } from '@nestjs/common';
import { repo } from '../infrastructure';

@Injectable()
export class EventParameterUseCase {
  constructor(private readonly routeRepo: repo.RouteRepo) {}
}
