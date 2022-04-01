import { Injectable } from '@nestjs/common';
import { repo } from '../infrastructure';

@Injectable()
export class MessagesUseCase {
  constructor(private readonly routeRepo: repo.RouteRepo) {}
}
