import { IsBoolean } from 'class-validator';

export class TransportConfig {
  @IsBoolean()
  wss: boolean;

  @IsBoolean()
  http: boolean;
}
