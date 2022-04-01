import { Injectable } from '@nestjs/common';
import { repo } from '../infrastructure';

@Injectable()
export class EventUseCase {
  constructor(private readonly routeRepo: repo.RouteRepo) {}
}
