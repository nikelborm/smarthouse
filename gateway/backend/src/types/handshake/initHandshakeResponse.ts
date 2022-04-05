import { Type } from 'class-transformer';
import {
  IsDefined,
  IsMACAddress,
  IsObject,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';

// TODO: убедиться, что вынес куда нибудь в нормальное место
// encryptionWorkerCredentials: {
//   clientPublicKey: string;
//   clientUUIDSignedByClientPrivateKey: string;
// };

export class WiFiCredentials {
  @IsMACAddress()
  BSSID: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class GatewayInfo {
  @IsUUID('4')
  uuid: string;

  @IsUrl({ protocols: ['ws', 'wss'] })
  WSAdress: string; // IP address inside wifi network (not localhost, because it is not universal)

  @IsUrl({ protocols: ['http', 'https'] })
  HTTPAdress: string; // same as WSAdress

  @IsDefined()
  @IsObject()
  encryptionModuleCredentials: Record<string, any>;
}

export class InitHandshakeResponse {
  @IsPositive()
  registeredClientId: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => GatewayInfo)
  gateway: GatewayInfo;

  @IsDefined()
  @ValidateNested()
  @Type(() => WiFiCredentials)
  wifi: WiFiCredentials;
}

// encryptionModuleCredentials: {
//   publicKey: string;
//   gatewayUUIDSignedByGatewayPrivateKey: string;
// };
