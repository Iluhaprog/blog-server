import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './user/user.entity';
import { Tag } from './tag/tag.entity';
import { RefreshToken } from './refresh-token/refresh-token.entity';
import { Project } from './project/project.entity';
import { Social } from './social/social.entity';
import { Post } from './post/post.entity';
import { Home } from './home/home.entity';
import { File } from './file/file.entity';
import { Locale } from './locale/locale.entity';

import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { SocialModule } from './social/social.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { ProjectModule } from './project/project.module';
import { PostModule } from './post/post.module';
import { HomeModule } from './home/home.module';
import { DirectoryModule } from './directory/directory.module';
import { Directory } from './directory/directory.entity';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LocaleModule } from './locale/locale.module';
import { PostData } from './post/post.data.entity';
import { ProjectData } from './project/project.data.entity';
import { HomeData } from './home/home.data.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../${process.env.STATIC_FILES}`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DBHOST,
      port: +process.env.DBPORT,
      username: process.env.DBUSER,
      password: process.env.DBPASS,
      database: process.env.DBNAME,
      entities: [
        User,
        Tag,
        Social,
        RefreshToken,
        Project,
        Post,
        Home,
        Directory,
        File,
        Locale,
        PostData,
        ProjectData,
        HomeData,
      ],
      synchronize: true,
      logging: false,
    }),
    UserModule,
    TagModule,
    SocialModule,
    RefreshTokenModule,
    ProjectModule,
    PostModule,
    HomeModule,
    DirectoryModule,
    FileModule,
    AuthModule,
    LocaleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
