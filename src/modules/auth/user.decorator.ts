import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDTO } from '../user/dto/user.dto';

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext): UserDTO => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user;
  },
);
