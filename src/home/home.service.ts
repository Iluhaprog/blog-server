import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Home } from './home.entity';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Home)
    private homeRepository: Repository<Home>,
  ) {}

  async getAll(): Promise<Home[] | any[] | undefined> {
    return await this.homeRepository.find();
  }

  async get(): Promise<Home | undefined> {
    return await this.homeRepository.findOne({
      where: {
        selected: true,
      },
    });
  }

  async create(home: CreateHomeDto): Promise<any> {
    return await this.homeRepository.save(this.homeRepository.create(home));
  }

  async update(home: UpdateHomeDto): Promise<void> {
    await this.homeRepository.update(home.id, home);
  }

  async remove(id: number): Promise<void> {
    await this.homeRepository.delete(id);
  }
}
