import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Locale } from '../locale/locale.entity';

@Entity()
export class UserData {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ default: ' ' })
  firstName: string;

  @ApiProperty()
  @Column({ default: ' ' })
  lastName: string;

  @ApiProperty()
  @Column({ type: 'text' })
  about: string;

  @ManyToOne(() => User, (user) => user.userData, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Locale, (locale) => locale.userData, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  locale: Locale;
}
