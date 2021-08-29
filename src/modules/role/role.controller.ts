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
import { ReadRoleDTO } from './dto/read-role.dto';
import { CreateRoleDTO } from './dto/create-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get(':id')
  getRole(@Param('id', ParseIntPipe) id: number): Promise<ReadRoleDTO> {
    return this._roleService.get(id);
  }

  @Get()
  getAllRoles(): Promise<ReadRoleDTO[]> {
    return this._roleService.getAll();
  }

  @Post()
  createRole(@Body() role: Partial<CreateRoleDTO>): Promise<ReadRoleDTO> {
    return this._roleService.create(role);
  }

  @Patch(':id')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() role: Partial<UpdateRoleDTO>,
  ): Promise<ReadRoleDTO> {
    return this._roleService.update(id, role);
  }

  @Delete(':id')
  async deleteRole(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this._roleService.delete(id);
  }
}
