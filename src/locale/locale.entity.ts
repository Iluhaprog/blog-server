import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PostData } from '../post/post.data.entity';
import { ProjectData } from '../project/project.data.entity';
import { HomeData } from '../home/home.data.entity';
import { UserData } from '../user/user.data.entity';

@Entity()
export class Locale {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @OneToMany(() => PostData, (postData) => postData.locale)
  postData: PostData;

  @OneToMany(() => ProjectData, (projectData) => projectData.locale)
  projectData: ProjectData;

  @OneToMany(() => HomeData, (homeData) => homeData.locale)
  homeData: HomeData[];

  @OneToMany(() => UserData, (userData: UserData) => userData.locale)
  userData: UserData[];
}
