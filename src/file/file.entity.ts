import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Directory } from '../directory/directory.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class File {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @Unique(['name'])
  name: string;

  @ManyToOne(() => Directory, (dir: Directory) => dir.files, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  directory: Directory;
}
