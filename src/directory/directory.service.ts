import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Directory } from './directory.entity';
import { Repository } from 'typeorm';
import { CreateDirectoryDto } from './dto/create-directory.dto';

@Injectable()
export class DirectoryService {
  constructor(
    @InjectRepository(Directory)
    private directoryRepository: Repository<Directory>,
  ) {}

  async getAll(page, limit): Promise<any> {
    const [data, total] = await this.directoryRepository.findAndCount({
      take: limit,
      skip: page,
    });
    return { data, total };
  }

  async create(directory: CreateDirectoryDto): Promise<any> {
    await this.directoryRepository.save(
      this.directoryRepository.create(directory),
    );
  }

  async remove(id: number): Promise<any> {
    await this.directoryRepository.delete(id);
  }
}
