import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.entity';
import { Locale } from '../locale/locale.entity';

@Entity()
export class ProjectData {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ default: ' ' })
  title: string;

  @ApiProperty()
  @Column({ default: ' ' })
  description: string;

  @ManyToOne(() => Project, (project) => project.projectData, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  project: Project;

  @ManyToOne(() => Locale, (locale) => locale.projectData, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  locale: Locale;
}
