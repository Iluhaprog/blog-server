import { ApiProperty } from '@nestjs/swagger';

class Locale {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

class ProjectDataType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  locale: Locale;
}

export class ProjectType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  preview: string;

  @ApiProperty()
  projectLink: string;

  @ApiProperty()
  githubLink: string;

  @ApiProperty({ type: [ProjectDataType] })
  projectData: ProjectDataType[];
}
