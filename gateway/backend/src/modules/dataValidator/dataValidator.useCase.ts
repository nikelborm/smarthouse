import { Injectable } from '@nestjs/common';
import { repo } from '../infrastructure';

@Injectable()
export class DataValidatorUseCase {
  constructor(private readonly routeRepo: repo.RouteRepo) {}
}
