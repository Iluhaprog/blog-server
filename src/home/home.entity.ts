import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { HomeData } from './home.data.entity';

@Entity()
export class Home {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ default: false })
  selected: boolean;

  @ApiProperty()
  @Column('text')
  description: string;

  @OneToMany(() => HomeData, (homeData) => homeData.home)
  homeData: HomeData[];
}
