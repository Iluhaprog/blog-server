import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PostData } from '../post/post.data.entity';

@Entity()
export class Locale {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @OneToMany((type) => PostData, (postData) => postData.locale)
  postData: PostData;
}
