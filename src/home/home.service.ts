import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Home } from './home.entity';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { HomeData } from './home.data.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Home)
    private homeRepository: Repository<Home>,
    @InjectRepository(HomeData)
    private homeDataRepository: Repository<HomeData>,
  ) {}

  async getAll(): Promise<Home[] | any[] | undefined> {
    return await this.homeRepository.find({
      relations: ['homeData', 'homeData.locale'],
    });
  }

  async get(): Promise<Home | undefined> {
    return await this.homeRepository.findOne({
      relations: ['homeData', 'homeData.locale'],
      where: {
        selected: true,
      },
    });
  }

  async create(home: CreateHomeDto): Promise<any> {
    return await this.homeRepository.save(this.homeRepository.create(home));
  }

  async update(home: UpdateHomeDto): Promise<void> {
    await Promise.all(
      home.homeData.map(async (homeData) => {
        return await this.homeDataRepository.save(
          this.homeDataRepository.create(homeData),
        );
      }),
    );
    await this.homeRepository.save(home);
  }

  async remove(id: number): Promise<void> {
    await this.homeRepository.delete(id);
  }
}
