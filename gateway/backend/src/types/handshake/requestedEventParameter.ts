import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class RequestedEventParameter {
  @IsUUID('4')
  UUID: string;

  @IsString()
  @MinLength(2)
  @MaxLength(140)
  name: string;

  @IsUUID('4')
  dataValidatorUUID: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  measurementUnit: string;
}
