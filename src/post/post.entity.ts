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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Post {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @Unique(['title'])
  title: string;

  @ApiProperty()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty()
  @Column({ type: 'bool', default: false})
  isVisible: boolean;

  @ApiProperty()
  @Column('text')
  text: string;

  @ApiProperty()
  @Column()
  preview: string;

  @ApiProperty()
  @Column()
  creationDate: Date;

  @ManyToOne(() => User, (user: User) => user.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToMany((type) => Tag, (tag) => tag.posts)
  @JoinTable()
  tags: Tag[];
}
