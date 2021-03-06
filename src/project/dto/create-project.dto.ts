import { ApiProperty } from '@nestjs/swagger';

class Locale {
  @ApiProperty()
  id: number;
}

class ProjectDataCT {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  locale: Locale;
}

export class CreateProjectDto {
  @ApiProperty()
  preview: string;

  @ApiProperty()
  projectLink: string;

  @ApiProperty()
  githubLink: string;

  @ApiProperty({ type: [ProjectDataCT] })
  projectData: ProjectDataCT[];
}
