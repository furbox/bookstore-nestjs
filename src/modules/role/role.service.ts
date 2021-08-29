import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { Role } from '../role/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<Role> {
    if (!id) {
      throw new BadRequestException('id must be send');
    }
    const role: Role = await this._roleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }

  async getAll(): Promise<Role[]> {
    const roles: Role[] = await this._roleRepository.find({
      where: { status: 'ACTIVE' },
    });

    return roles;
  }

  async create(role: Role): Promise<Role> {
    const savedRole = await this._roleRepository.save(role);
    return savedRole;
  }

  async update(id: number, role: Role): Promise<void> {
    // const updateRole: Role = await this._roleRepository.update(id, role);
    await this._roleRepository.update(id, role);
    // return this._mapperService.map<Role, Role>(updateRole, new Role());
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
