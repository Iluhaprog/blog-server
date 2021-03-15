import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { File } from '../file/file.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Directory {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @Unique(['name'])
  name: string;

  @OneToMany(() => File, (file: File) => file.directory)
  files: File[];
}
