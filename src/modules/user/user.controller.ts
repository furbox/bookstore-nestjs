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
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
    const user = await this._userService.get(id);
    return user;
  }

  @Get()
  async getAllUsers(): Promise<UserDTO[]> {
    const users = await this._userService.getAll();
    return users;
  }

  @Post()
  async createUser(@Body() user: User): Promise<UserDTO> {
    const userCreate = await this._userService.create(user);
    return userCreate;
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<void> {
    const updateUser = await this._userService.update(id, user);
    return updateUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleteUser = await this._userService.delete(id);
    return deleteUser;
  }
}
