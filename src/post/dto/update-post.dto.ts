import { ApiProperty } from '@nestjs/swagger';

type TagsId = number[];

export class UpdatePostDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  preview: string;

  @ApiProperty({ type: [Number] })
  tags: TagsId;
}
