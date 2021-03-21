import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Social } from './social.entity';
import { Repository } from 'typeorm';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { Order } from '../types/order.type';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(Social)
    private socialRepository: Repository<Social>,
  ) {}

  async getAll(order: Order = 'ASC'): Promise<Social[] | any[] | undefined> {
    return await this.socialRepository.find({
      order: { id: order },
    });
  }

  async create(social: CreateSocialDto, userId: number): Promise<any> {
    return await this.socialRepository.save(
      this.socialRepository.create({
        ...social,
        user: { id: userId },
      }),
    );
  }

  async update(social: UpdateSocialDto): Promise<void> {
    await this.socialRepository.update(social.id, social);
  }

  async remove(id: number) {
    await this.socialRepository.delete(id);
  }
}
