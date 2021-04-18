import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Order } from '../types/order.type';
import { ProjectData } from './project.data.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectData)
    private projectDataRepository: Repository<ProjectData>,
  ) {}

  async findAll(order: Order = 'ASC'): Promise<Project[] | any[] | undefined> {
    return this.projectRepository.find({
      relations: ['projectData', 'projectData.locale'],
      order: { id: order },
    });
  }

  async addData(localeId: number, projectId: number): Promise<any> {
    const findProject = await this.projectRepository.findOne(projectId);
    const newProjectData = await this.projectDataRepository.save({
      title: '',
      description: '',
      locale: { id: localeId },
    });
    await this.projectRepository.save({
      ...findProject,
      projectData: [newProjectData],
    });
    return newProjectData;
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
    await Promise.all(
      project.projectData.map(async (postData) => {
        return await this.projectDataRepository.save(
          this.projectDataRepository.create(postData),
        );
      }),
    );
    await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
