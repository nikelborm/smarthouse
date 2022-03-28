import { IsString, MaxLength, MinLength } from 'class-validator';

export class SetMyPasswordDTO {
  // TODO sync with CreateUserDTO
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;
}
