import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Directory } from '../directory/directory.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['name'])
  name: string;

  @ManyToOne(() => Directory, (dir: Directory) => dir.files, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  directory: Directory;
}
