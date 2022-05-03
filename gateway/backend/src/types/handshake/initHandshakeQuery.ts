import { Type } from 'class-transformer';
import {
  IsDefined,
  IsObject,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { SupportedInterfaces } from './supportedInterfaces';

export class InitHandshakeQuery {
  @IsString()
  @MinLength(2)
  @MaxLength(70)
  shortname!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(140)
  fullname!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsUUID('4')
  uuid!: string;

  @IsUUID('4')
  encryptionWorkerUUID!: string;

  @IsObject()
  encryptionWorkerCredentials!: Record<string, any>;

  @IsDefined()
  @ValidateNested()
  @Type(() => SupportedInterfaces)
  supported!: SupportedInterfaces;
}
