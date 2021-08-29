import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto';
import { SignUpDTO } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() signUpDTO: SignUpDTO): Promise<void> {
    return this, this._authService.signup(signUpDTO);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signin(@Body() signInDTO: SignInDTO) {
    return this._authService.signin(signInDTO);
  }
}
