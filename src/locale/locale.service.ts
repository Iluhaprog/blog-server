import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locale } from './locale.entity';
import { CreateLocaleDto } from './dto/create-locale.dto';

@Injectable()
export class LocaleService {
  constructor(
    @InjectRepository(Locale)
    private localeRepository: Repository<Locale>,
  ) {}

  async findAll(): Promise<Locale[]> {
    return await this.localeRepository.find();
  }

  async findById(id: number): Promise<Locale> {
    return await this.localeRepository.findOne({
      where: { id },
    });
  }

  async create(locale: CreateLocaleDto): Promise<Locale> {
    return await this.localeRepository.save(
      this.localeRepository.create(locale),
    );
  }

  async remove(id: number): Promise<any> {
    await this.localeRepository.delete(id);
  }
}
