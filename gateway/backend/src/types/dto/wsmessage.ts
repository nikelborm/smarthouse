import { plainToInstance, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  validateSync,
  ValidateNested,
} from 'class-validator';

export class BaseMessageReport {
  @IsBoolean()
  isOk: boolean;

  @IsOptional()
  @IsPositive()
  code?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

// Сообщение, которое отправляются друг другу
export class AuthMessage {
  @IsUUID('4')
  clientUUID: string;

  @IsObject()
  credentials: Record<string, any>;
}

export class MessageParameter {
  @IsUUID('4')
  uuid: string;

  @IsDefined()
  value: string;
}

export class DecryptedRegularMessage {
  @IsUUID('4')
  messageUUID: string;

  @IsUUID('4')
  endpointUUID: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MessageParameter)
  parameters?: MessageParameter[];
}

const validateConfig = {
  validationError: {
    target: false,
  },
  stopAtFirstError: true,
  whitelist: true,
  forbidNonWhitelisted: true,
};

export function validate<P>(payload: P, payloadClass: { new (): P }) {
  const payloadInstance = plainToInstance(payloadClass, payload);
  return validateSync(payloadInstance as any, validateConfig);
}

export function validateWithBase<U>(
  entity: BaseMessage<U>,
  payloadClass: { new (): U },
) {
  const baseMessageInstance = plainToInstance(BaseMessage, entity);
  const baseErrors = validateSync(baseMessageInstance as any, validateConfig);

  const payloadErrors = validate(entity.payload, payloadClass);

  return [...baseErrors, ...payloadErrors];
}

export class BaseMessage<T> {
  @IsDefined()
  @IsObject()
  payload: T;

  @IsDefined()
  @ValidateNested()
  @Type(() => BaseMessageReport)
  report: BaseMessageReport;
}
