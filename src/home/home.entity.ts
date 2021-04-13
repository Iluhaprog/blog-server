import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { HomeData } from './home.data.entity';

@Entity()
export class Home {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ default: false })
  selected: boolean;

  @OneToMany(() => HomeData, (homeData) => homeData.home)
  homeData: HomeData[];
}
