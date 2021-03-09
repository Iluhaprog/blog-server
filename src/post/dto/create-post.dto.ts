import { ApiProperty } from '@nestjs/swagger';

type TagsId = number[];

export class CreatePostDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  preview: string;

  @ApiProperty({ type: [Number] })
  tags: TagsId;
}
