import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
@Unique(['title'])
export class Social {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  link: string;

  @Column()
  preview: string;

  @ManyToOne(() => User, (user: User) => user.socials, { onDelete: 'CASCADE' })
  user: User;
}
