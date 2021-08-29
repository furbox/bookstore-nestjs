import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO } from './dto/signup.dto';
import { SignInDTO } from './dto/signin.dto';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { IJwtPayload } from './jwt-payload.interface';
import { RoleType } from '../role/role.types.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService,
  ) {}

  async signup(signUpDTO: SignUpDTO): Promise<void> {
    const { username, email } = signUpDTO;
    const userExists = await this._authRepository.findOne({
      where: [{ username }, { email }],
    });
    if (userExists) {
      throw new ConflictException('username or email already exists');
    }

    return this._authRepository.signup(signUpDTO);
  }

  async signin(signInDTO: SignInDTO): Promise<{ token: string }> {
    const { username, password } = signInDTO;
    const user: User = await this._authRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid user or password');
    }

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map((r) => r.name as RoleType),
    };

    const token = await this._jwtService.sign(payload);

    return { token };
  }
}