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

  async addData(localeId: number, homeId: number): Promise<any> {
    const findHome = await this.homeRepository.findOne(homeId);
    const newHomeData = await this.homeDataRepository.save({
      title: '',
      description: '',
      locale: { id: localeId },
    });
    await this.homeRepository.save({
      ...findHome,
      homeData: [newHomeData],
    });
    return newHomeData;
  }

  async create(home: CreateHomeDto): Promise<any> {
    const newHome = await this.homeRepository.save(this.homeRepository.create(home));
    await Promise.all(
      home.homeData.map(async (homeData) => {
        return await this.homeDataRepository.save(
          this.homeDataRepository.create({
            ...homeData,
            home: { id: newHome.id },
          }),
        );
      }),
    );
    return await this.homeRepository.findOne(newHome.id, {
      relations: ['homeData', 'homeData.locale'],
    });
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
