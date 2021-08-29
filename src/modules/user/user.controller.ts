import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
// import { Roles } from '../role/decorators/role.decorator';
// import { RoleGuard } from '../role/guards/role.guard';
// import { RoleType } from '../role/role.types.enum';
import { ReadUserDTO } from './dto/read-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':id')
  // @Roles(RoleType.ADMINISTRATOR)
  // @UseGuards(AuthGuard(), RoleGuard)
  getUser(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDTO> {
    return this._userService.get(id);
  }

  @UseGuards(AuthGuard())
  @Get()
  getAllUsers(): Promise<ReadUserDTO[]> {
    return this._userService.getAll();
  }

  @Post()
  createUser(@Body() user: Partial<CreateUserDTO>): Promise<ReadUserDTO> {
    return this._userService.create(user);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: Partial<UpdateUserDTO>,
  ): Promise<ReadUserDTO> {
    return this._userService.update(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<{ msg: string }> {
    const msg = this._userService.delete(id);
    return msg;
  }

  @Post('setrole/:userId/:roleId')
  setRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<boolean> {
    return this._userService.setRoleToUser(userId, roleId);
  }
}
