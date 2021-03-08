import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compareSync } from 'bcrypt';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    login: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.userService.findByLogin(login);
    if (user && compareSync(password, user.password)) {
      return user;
    }
    return;
  }

  async login(user: User) {
    const payload = { id: user.id };
    const refreshToken = (await this.refreshTokenService.create(user.id)).token;
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string, userId: number) {
    const oldRefreshToken = await this.refreshTokenService.get(token);
    if (
      !oldRefreshToken ||
      !this.refreshTokenService.isValid(moment(oldRefreshToken.expireIn))
    ) {
      throw new UnauthorizedException();
    }
    await this.refreshTokenService.remove(token, userId);

    const payload = { id: userId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = (await this.refreshTokenService.create(userId)).token;
    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(token: string, userId: number) {
    await this.refreshTokenService.remove(token, userId);
  }

  async logoutAll(userId: number) {
    await this.refreshTokenService.removeByUserId(userId);
  }
}
