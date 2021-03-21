import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { Order } from '../types/order.type';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async getAll(order: Order = 'ASC'): Promise<Tag[] | any[] | undefined> {
    return await this.tagRepository.find({
      order: { id: order },
    });
  }

  async create(tag: CreateTagDto): Promise<any> {
    return await this.tagRepository.save(this.tagRepository.create(tag));
  }

  async remove(id: number) {
    await this.tagRepository.delete(id);
  }
}
