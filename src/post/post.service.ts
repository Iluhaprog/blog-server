import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { getManager, In, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Order } from '../types/order.type';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findVisible(page, limit, order: Order = 'ASC'): Promise<any> {
    const [data, total] = await this.postRepository.findAndCount({
      order: { id: order },
      relations: ['tags'],
      take: limit,
      skip: page,
      where: {
        isVisible: true,
      },
    });
    return { data, total };
  }

  async findAll(page, limit, order: Order = 'ASC'): Promise<any> {
    const [data, total] = await this.postRepository.findAndCount({
      order: { id: order },
      relations: ['tags'],
      take: limit,
      skip: page,
    });
    return { data, total };
  }

  async findById(id: number): Promise<Post | undefined> {
    return await this.postRepository.findOne(id, {
      relations: ['tags'],
    });
  }

  async findByTags(tags: number[], page, limit): Promise<any> {
    return await this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.tags', 'tag', 'tag.id IN (:...tags)', { tags })
      .where('post.isVisible = :isVisible', { isVisible: true })
      .take(page)
      .limit(limit)
      .getManyAndCount();
  }

  async findLast(): Promise<Post[] | [] | undefined> {
    return await this.postRepository.find({
      order: {
        creationDate: 'DESC',
      },
      take: +process.env.LAST_POSTS_TAKE,
    });
  }

  async create(post: CreatePostDto, userId: number): Promise<any> {
    return await this.postRepository.save(
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
      tags: post.tags,
    });
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
