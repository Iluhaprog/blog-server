import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async getAll(page, limit): Promise<any> {
    const [data, total] = await this.fileRepository.findAndCount({
      take: limit,
      skip: page,
    });
    return { data, total };
  }

  async create(file: CreateFileDto): Promise<void> {
    await this.fileRepository.save(this.fileRepository.create(file));
  }

  async remove(id: number): Promise<void> {
    await this.fileRepository.delete(id);
  }
}
