import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { Order } from '../types/order.type';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async getAll(page, limit, order: Order = 'ASC'): Promise<any> {
    const [data, total] = await this.fileRepository.findAndCount({
      order: { id: order },
      take: limit,
      skip: page,
    });
    return { data, total };
  }

  async getByDirId(dirId: number, order: Order = 'ASC'): Promise<any> {
    return await this.fileRepository.find({
      order: { id: order },
      where: {
        directory: { id: dirId },
      },
    });
  }

  async create(file: CreateFileDto): Promise<any> {
    return await this.fileRepository.save(this.fileRepository.create(file));
  }

  async remove(id: number): Promise<void> {
    await this.fileRepository.delete(id);
  }
}
