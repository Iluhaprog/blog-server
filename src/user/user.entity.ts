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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  @MinLength(8, { message: 'Password is short' })
  password: string;

  @Column('text')
  about: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  avatar: string;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    const errors = await validate(this);
    if (errors.length) throw new Error(errors[0].toString());
  }

  @BeforeInsert()
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
}
