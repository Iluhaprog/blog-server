import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Home } from './home.entity';
import { Locale } from '../locale/locale.entity';

@Entity()
export class HomeData {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ default: ' ' })
  title: string;

  @ApiProperty()
  @Column({ default: ' ' })
  description: string;

  @ManyToOne(() => Home, (home) => home.homeData, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  home: Home;

  @ManyToOne(() => Locale, (locale) => locale.homeData, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  locale: Locale;
}
