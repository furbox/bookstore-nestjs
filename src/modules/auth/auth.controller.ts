import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO, LoggedInDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signup(@Body() signUpDTO: SignUpDTO): Promise<void> {
    return this, this._authService.signup(signUpDTO);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  signin(@Body() signInDTO: SignInDTO): Promise<LoggedInDTO> {
    return this._authService.signin(signInDTO);
  }
}
