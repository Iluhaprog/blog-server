import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { File } from '../file/file.entity';

@Entity()
export class Directory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['name'])
  name: string;

  @OneToMany(() => File, (file: File) => file.directory)
  files: File[];
}
