import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async getAll(): Promise<Tag[] | any[] | undefined> {
    return await this.tagRepository.find();
  }

  async create(tag: CreateTagDto): Promise<void> {
    await this.tagRepository.save(this.tagRepository.create(tag));
  }

  async remove(id: number) {
    await this.tagRepository.delete(id);
  }
}
