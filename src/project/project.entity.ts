import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from '../user/user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['title'])
  title: string;

  @Column('text')
  description: string;

  @Column()
  preview: string;

  @Column()
  projectLink: string;

  @Column()
  githubLink: string;

  @ManyToOne(() => User, (user: User) => user.projects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
