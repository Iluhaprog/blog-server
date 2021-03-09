import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty()
  id: number;

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
