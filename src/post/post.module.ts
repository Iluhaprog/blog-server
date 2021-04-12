import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostData } from "./post.data.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostData])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
