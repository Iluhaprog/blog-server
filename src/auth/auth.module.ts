import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { AuthController } from './auth.controller';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
