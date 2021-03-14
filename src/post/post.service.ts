import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { getManager, In, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findAll(page, limit): Promise<any> {
    const [data, total] = await this.postRepository.findAndCount({
      take: limit,
      skip: page,
    });
    return { data, total };
  }

  async findById(id: number): Promise<Post | undefined> {
    return await this.postRepository.findOne(id);
  }

  async findByTags(tags: number[]): Promise<Post[] | [] | undefined> {
    return await this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.tags', 'tag', 'tag.id IN (:...tags)', { tags })
      .getMany();
  }

  async findLast(): Promise<Post[] | [] | undefined> {
    return await this.postRepository.find({
      order: {
        creationDate: 'DESC',
      },
      take: +process.env.LAST_POSTS_TAKE,
    });
  }

  async create(post: CreatePostDto, userId: number): Promise<void> {
    await this.postRepository.save(
      this.postRepository.create({
        ...post,
        creationDate: new Date(),
        user: { id: userId },
        tags: post.tags.map((tag: number) => ({ id: tag })),
      }),
    );
  }

  async update(post: UpdatePostDto): Promise<void> {
    await this.postRepository.save({
      ...post,
      tags: post.tags.map((tag: number) => ({ id: tag })),
    });
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
