import { ApiProperty } from '@nestjs/swagger';

class ProjectDataUT {
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

  @ApiProperty({ type: [ProjectDataUT] })
  projectData: ProjectDataUT[];

  @ApiProperty()
  preview: string;

  @ApiProperty()
  projectLink: string;

  @ApiProperty()
  githubLink: string;
}
