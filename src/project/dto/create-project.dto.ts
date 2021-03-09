import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  preview: string;

  @ApiProperty()
  projectLink: string;

  @ApiProperty()
  githubLink: string;
}
