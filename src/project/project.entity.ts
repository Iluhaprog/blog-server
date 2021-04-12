import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectData } from './project.data.entity';

@Entity()
export class Project {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  preview: string;

  @ApiProperty()
  @Column()
  projectLink: string;

  @ApiProperty()
  @Column()
  githubLink: string;

  @ManyToOne(() => User, (user: User) => user.projects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @OneToMany(() => ProjectData, (projectData) => projectData.project)
  projectData: ProjectData[];
}
