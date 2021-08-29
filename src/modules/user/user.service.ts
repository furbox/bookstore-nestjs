import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserDetails } from './user.details.entity';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleRepository } from '../role/role.repository';
import { status } from 'src/shared/entity.status.enum';
import { ReadUserDTO, CreateUserDTO, UpdateUserDTO } from './dto';
import { plainToClass } from 'class-transformer';
import { RoleType } from '../role/role.types.enum';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<ReadUserDTO> {
    if (!id) {
      throw new BadRequestException('id must be send');
    }
    const user: User = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return plainToClass(ReadUserDTO, user);
  }

  async getAll(): Promise<ReadUserDTO[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: status.ACTIVE },
    });

    return users.map((user: User) => plainToClass(ReadUserDTO, user));
  }

  async create(userDTO: Partial<CreateUserDTO>): Promise<ReadUserDTO> {
    const { username, email, password } = userDTO;
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

    return plainToClass(ReadUserDTO, user);
  }

  async update(id: number, user: Partial<UpdateUserDTO>): Promise<ReadUserDTO> {
    if (!id) {
      throw new BadRequestException('id must be send');
    }
    const foundUser: User = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!foundUser) {
      throw new NotFoundException('User does not exist');
    }
    foundUser.username = user.username;
    const updateUser = await this._userRepository.save(foundUser);
    return plainToClass(ReadUserDTO, updateUser);
  }

  async delete(id: number): Promise<{ msg: string }> {
    if (!id) {
      throw new BadRequestException('id must be send');
    }
    const user: User = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }
    await this._userRepository.update(id, { status: 'INACTIVE' });
    return { msg: 'user deleted' };
  }

  async setRoleToUser(userId: number, roleId: number): Promise<boolean> {
    const userExist = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });

    if (!userExist) {
      throw new NotFoundException('User does not exist');
    }

    const roleExist = await this._roleRepository.findOne(roleId, {
      where: { status: status.ACTIVE },
    });

    if (!roleExist) {
      throw new NotFoundException('Role does not exist');
    }

    userExist.roles.push(roleExist);

    await this._userRepository.save(userExist);

    return true;
  }
}
