import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Tag } from '../tag/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['title'])
  title: string;

  @Column('text')
  text: string;

  @Column()
  preview: string;

  @Column()
  creationDate: Date;

  @ManyToOne(() => User, (user: User) => user.posts, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToMany((type) => Tag, (tag) => tag.posts)
  @JoinTable()
  tags: Tag[];
}
