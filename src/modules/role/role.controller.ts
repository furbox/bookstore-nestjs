import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.entity';

@Controller('roles')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get(':id')
  async getRole(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    const role = await this._roleService.get(id);
    return role;
  }

  @Get()
  async getAllRoles(): Promise<Role[]> {
    const roles = await this._roleService.getAll();
    return roles;
  }

  @Post()
  async createRole(@Body() role: Role): Promise<Role> {
    const roleCreate = await this._roleService.create(role);
    return roleCreate;
  }

  @Patch(':id')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() role: Role,
  ): Promise<void> {
    const updateRole = await this._roleService.update(id, role);
    return updateRole;
  }

  @Delete(':id')
  async deleteRole(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleteRole = await this._roleService.delete(id);
    return deleteRole;
  }
}
