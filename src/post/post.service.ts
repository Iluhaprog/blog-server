import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { getManager, In, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Order } from '../types/order.type';
import { PostData } from './post.data.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostData)
    private postDataRepository: Repository<PostData>,
  ) {}

  async findVisible(page, limit, order: Order = 'ASC'): Promise<any> {
    const [data, total] = await this.postRepository.findAndCount({
      order: { id: order },
      relations: ['tags', 'postData', 'postData.locale'],
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
      relations: ['tags', 'postData', 'postData.locale'],
      take: limit,
      skip: page,
    });
    return { data, total };
  }

  async findById(id: number): Promise<Post | undefined> {
    return await this.postRepository.findOne(id, {
      relations: ['tags', 'postData', 'postData.locale'],
    });
  }

  async findByTags(tags: number[], page, limit): Promise<any> {
    return await this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.tags', 'tag', 'tag.id IN (:...tags)', { tags })
      .innerJoinAndSelect('post.postData', 'postData')
      .innerJoinAndSelect('postData.locale', 'locale')
      .where('post.isVisible = :isVisible', { isVisible: true })
      .take(page)
      .limit(limit)
      .getManyAndCount();
  }

  async findLast(): Promise<Post[] | [] | undefined> {
    return await this.postRepository.find({
      relations: ['postData', 'postData.locale'],
      order: {
        creationDate: 'DESC',
      },
      take: +process.env.LAST_POSTS_TAKE,
    });
  }

  async addData(localeId: number, postId: number): Promise<any> {
    const findPost = await this.postRepository.findOne(postId);
    const newPostData = await this.postDataRepository.save({
      title: '',
      description: '',
      text: '',
      locale: { id: localeId },
    });
    await this.postRepository.save({
      ...findPost,
      postData: [newPostData],
    });
    return newPostData;
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
    await Promise.all(
      post.postData.map(async (postData) => {
        return await this.postDataRepository.save(
          this.postDataRepository.create(postData),
        );
      }),
    );
    await this.postRepository.save(
      this.postRepository.create({
        ...post,
        tags: post.tags,
      }),
    );
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
