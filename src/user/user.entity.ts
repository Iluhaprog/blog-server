import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, MinLength, validate } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Social } from '../social/social.entity';
import { RefreshToken } from '../refresh-token/refresh-token.entity';
import { Project } from '../project/project.entity';
import { Post } from '../post/post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  login: string;

  @ApiProperty()
  @Column()
  @MinLength(8, { message: 'Password is short' })
  password: string;

  @ApiProperty()
  @Column('text')
  about: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column()
  avatar: string;

  @ApiProperty()
  @Column({ default: '' })
  skills: string;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    const errors = await validate(this);
    if (errors.length) throw new Error(errors[0].toString());
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const saltRounds = 10;
      try {
        this.password = await bcrypt.hash(this.password, saltRounds);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }
  }

  @OneToMany(() => Social, (social: Social) => social.user)
  socials: Social[];

  @OneToMany(() => RefreshToken, (token: RefreshToken) => token.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => Project, (project: Project) => project.user)
  projects: Project[];

  @OneToMany(() => Post, (post: Post) => post.user)
  posts: Post[];
}
