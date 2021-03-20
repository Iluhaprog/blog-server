import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[] | any[] | undefined> {
    return this.projectRepository.find();
  }

  async create(project: CreateProjectDto, userId: number): Promise<any> {
    return await this.projectRepository.save(
      this.projectRepository.create({
        ...project,
        user: { id: userId },
      }),
    );
  }

  async update(project: UpdateProjectDto): Promise<void> {
    await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
