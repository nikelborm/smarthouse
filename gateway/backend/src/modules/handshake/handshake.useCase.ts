import { Injectable } from '@nestjs/common';
import { repo } from '../infrastructure';

@Injectable()
export class HandshakeUseCase {
  constructor(private readonly routeRepo: repo.RouteRepo) {}
}
