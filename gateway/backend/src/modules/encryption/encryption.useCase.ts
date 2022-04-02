import { Injectable } from '@nestjs/common';
import { repo } from '../infrastructure';

@Injectable()
export class EncryptionUseCase {
  constructor(private readonly routeRepo: repo.RouteRepo) {}
}
