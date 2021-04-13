import { ApiProperty } from '@nestjs/swagger';

class ProjectData {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  locale: { id: number };
}

export class CreateProjectDto {
  @ApiProperty()
  preview: string;

  @ApiProperty()
  projectLink: string;

  @ApiProperty()
  githubLink: string;

  @ApiProperty()
  projectData: ProjectData[];
}
