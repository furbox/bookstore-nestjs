import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserDetails } from '../user.details.entity';
import { Role } from '../../role/role.entity';

export class CreateUserDTO {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @Type()
  roles: Role[];

  @Type()
  details: UserDetails;
}
