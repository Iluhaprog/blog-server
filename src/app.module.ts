import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity';
import { Tag } from './tag/tag.entity';
import { Social } from './social/social.entity';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { SocialModule } from './social/social.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { RefreshToken } from './refresh-token/refresh-token.entity';
import { ProjectModule } from './project/project.module';
import { Project } from './project/project.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DBHOST,
      port: +process.env.DBPORT,
      username: process.env.DBUSER,
      password: process.env.DBPASS,
      database: process.env.DBNAME,
      entities: [User, Tag, Social, RefreshToken, Project],
      synchronize: true,
      logging: false,
    }),
    UserModule,
    TagModule,
    SocialModule,
    RefreshTokenModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
