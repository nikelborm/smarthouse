import { Type } from 'class-transformer';
import { IsArray, IsDefined, ValidateNested } from 'class-validator';
import { RequestedEndpoint } from './requestedEndpoint';
import { RequestedEvent } from './requestedEvent';
import { RequestedEventParameter } from './requestedEventParameter';
import { TransportConfig } from './transportConfig';

export class SupportedInterfaces {
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequestedEvent)
  events!: RequestedEvent[];

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequestedEventParameter)
  eventParameters!: RequestedEventParameter[];

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequestedEndpoint)
  routeEndpoints!: RequestedEndpoint[];

  @IsDefined()
  @ValidateNested()
  @Type(() => TransportConfig)
  transport!: TransportConfig;
}
