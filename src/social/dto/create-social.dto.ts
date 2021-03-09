import { ApiProperty } from '@nestjs/swagger';

export class CreateSocialDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  preview: string;

  @ApiProperty()
  link: string;
}
