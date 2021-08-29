import { EntityRepository, Repository, getConnection } from 'typeorm';
import { User } from '../user/user.entity';
import { SignUpDTO } from './dto';
import { RoleRepository } from '../role/role.repository';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/role.types.enum';
import { UserDetails } from '../user/user.details.entity';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup(signUpDTO: SignUpDTO) {
    const { username, email, password } = signUpDTO;
    const user = new User();
    user.username = username;
    user.email = email;

    const roleRepository: RoleRepository = await getConnection().getRepository(
      Role,
    );
    const defaultRole: Role = await roleRepository.findOne({
      where: { name: RoleType.GENERAL },
    });

    user.roles = [defaultRole];

    const details = new UserDetails();
    user.details = details;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
  }
}
