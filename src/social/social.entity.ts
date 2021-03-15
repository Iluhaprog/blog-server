import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['title'])
export class Social {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  link: string;

  @ApiProperty()
  @Column()
  preview: string;

  @ManyToOne(() => User, (user: User) => user.socials, { onDelete: 'CASCADE' })
  user: User;
}
