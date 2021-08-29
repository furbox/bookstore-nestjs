import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { Role } from '../role/role.entity';
import { ReadRoleDTO } from './dto/read-role.dto';
import { plainToClass } from 'class-transformer';
import { CreateRoleDTO } from './dto/create-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';
import { exists } from 'fs';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<ReadRoleDTO> {
    if (!id) {
      throw new BadRequestException('id must be send');
    }
    const role: Role = await this._roleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return plainToClass(ReadRoleDTO, role);
  }

  async getAll(): Promise<ReadRoleDTO[]> {
    const roles: Role[] = await this._roleRepository.find({
      where: { status: 'ACTIVE' },
    });

    return roles.map((role: Role) => plainToClass(ReadRoleDTO, role));
  }

  async create(role: Partial<CreateRoleDTO>): Promise<ReadRoleDTO> {
    const savedRole = await this._roleRepository.save(role);
    return plainToClass(ReadRoleDTO, savedRole);
  }

  async update(
    roleId: number,
    role: Partial<UpdateRoleDTO>,
  ): Promise<ReadRoleDTO> {
    if (!roleId) {
      throw new BadRequestException('id must be send');
    }
    const roleExits: Role = await this._roleRepository.findOne(roleId, {
      where: { status: 'ACTIVE' },
    });

    if (!roleExits) {
      throw new NotFoundException();
    }
    roleExits.name = role.name;
    roleExits.description = role.description;

    const updateRole = await this._roleRepository.save(roleExits);

    return plainToClass(ReadRoleDTO, updateRole);
  }

  async delete(id: number): Promise<void> {
    if (!id) {
      throw new BadRequestException('id must be send');
    }
    const role: Role = await this._roleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!role) {
      throw new NotFoundException();
    }
    await this._roleRepository.update(id, { status: 'INACTIVE' });
  }
}
