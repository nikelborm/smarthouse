import {
  IsArray,
  IsDefined,
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EventType } from '../eventType';

export class RequestedEvent {
  @IsUUID('4')
  UUID: string;

  @IsString()
  @MinLength(2)
  @MaxLength(140)
  name: string;

  @IsString()
  @MinLength(2)
  description: string;

  @IsEnum(EventType)
  type: EventType;

  @IsDefined()
  @IsArray()
  @IsUUID('4', { each: true })
  requiredParameterUUIDs: string[];

  @IsDefined()
  @IsArray()
  @IsUUID('4', { each: true })
  optionalParameterUUIDs: string[];

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  hexColor: string;
}
