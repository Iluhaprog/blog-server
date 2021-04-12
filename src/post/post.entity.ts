import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Tag } from '../tag/tag.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PostData } from './post.data.entity';

@Entity()
export class Post {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'bool', default: false })
  isVisible: boolean;

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

  @ApiProperty({ name: 'postData', type: [PostData] })
  @OneToMany((type) => PostData, (postData) => postData.post)
  postData: PostData[];
}
