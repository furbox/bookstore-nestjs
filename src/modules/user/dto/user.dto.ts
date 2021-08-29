import { IsEmail, IsNotEmpty } from 'class-validator';
import { RoleType } from '../../role/role.types.enum';
import { UserDetails } from '../user.details.entity';

export class UserDTO {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  roles: RoleType[];

  @IsNotEmpty()
  details: UserDetails;
}
