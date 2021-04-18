import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';
import { Locale } from '../locale/locale.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class PostData {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ default: '' })
  title: string;

  @ApiProperty()
  @Column({ default: '' })
  description: string;

  @ApiProperty()
  @Column({ default: '' })
  text: string;

  @ManyToOne((type) => Post, (post) => post.postData, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  post: Post;

  @ManyToOne((type) => Locale, (locale) => locale.postData, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  locale: Locale;
}
