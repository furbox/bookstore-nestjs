import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ReadDetailsUserDTO } from './read-details-user.dto';

export class ReadUserDTO {
  @IsNotEmpty()
  readonly id: number;

  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @Type((type) => ReadDetailsUserDTO)
  readonly details: ReadDetailsUserDTO;
}
