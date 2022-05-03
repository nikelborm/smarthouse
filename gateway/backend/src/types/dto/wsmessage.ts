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
  isUUID,
} from 'class-validator';
import type { SerializedIntoJsonData } from 'src/modules/dataValidator/IDataValidator';

export class BaseMessageReport {
  @IsBoolean()
  isOk!: boolean;

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
  clientUUID!: string;

  @IsObject()
  credentials!: Record<string, any>;
}

export class MessageParameter {
  @IsUUID('4')
  uuid!: string;

  @IsDefined()
  value: SerializedIntoJsonData;
}

export interface IDecryptedRegularMessage {
  messageUUID: string;
  endpointUUID: string;
  replyForMessageUUID?: string;
  parameters?: MessageParameter[];
}

export class DecryptedRegularMessage implements IDecryptedRegularMessage {
  @IsUUID('4')
  messageUUID!: string;

  @IsUUID('4')
  endpointUUID!: string;

  @IsOptional()
  @IsUUID('4')
  replyForMessageUUID?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MessageParameter)
  parameters?: MessageParameter[];

  getParameterValueBy(uuid: string) {
    if (!isUUID(uuid))
      throw new Error(
        'DecryptedRegularMessage getParameterValueBy: function parameter should be uuid',
      );

    const parameter = this.parameters?.find((param) => param.uuid === uuid);

    return parameter?.value || null;
  }
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
  payload!: T;

  @IsDefined()
  @ValidateNested()
  @Type(() => BaseMessageReport)
  report!: BaseMessageReport;
}
