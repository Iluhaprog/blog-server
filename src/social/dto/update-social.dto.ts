import { ApiProperty } from '@nestjs/swagger';

export class UpdateSocialDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  preview: string;

  @ApiProperty()
  link: string;
}
