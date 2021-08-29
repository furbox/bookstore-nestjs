import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '../../../config/config.service';
import { Configuration } from '../../../config/config.keys';
import { AuthRepository } from '../auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { IJwtPayload } from '../jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _config: ConfigService,
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _config.get(Configuration.JWT_SECRET),
    });
  }

  async validate(payload: IJwtPayload) {
    const { username } = payload;
    const user = await this._authRepository.findOne({
      where: { username, status: 'ACTIVE' },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
