import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectData } from './project.data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectData])],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
