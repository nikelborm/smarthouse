import {
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { EndpointType } from '../endpointType';

export class RequestedEndpoint {
  @IsUUID('4')
  uuid!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(140)
  name!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(4)
  shortcode!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @ValidateIf(
    (endpoint: RequestedEndpoint) =>
      endpoint.type !== EndpointType.UNIVERSAL_SINK,
  )
  @IsUUID('4')
  eventUUID?: string;

  @IsEnum(EndpointType)
  type!: EndpointType;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  hexColor!: string;
}
