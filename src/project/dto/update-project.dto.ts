import { ApiProperty } from '@nestjs/swagger';

class ProjectData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}

export class UpdateProjectDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  projectData: ProjectData[];

  @ApiProperty()
  preview: string;

  @ApiProperty()
  projectLink: string;

  @ApiProperty()
  githubLink: string;
}
