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
      entities: [User, Tag, Social],
      synchronize: true,
      logging: false,
    }),
    UserModule,
    TagModule,
    SocialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
