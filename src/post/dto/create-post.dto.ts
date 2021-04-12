import { ApiProperty } from '@nestjs/swagger';
import { Locale } from '../../locale/locale.entity';

type TagsId = number[];

class PostData {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  locale: Locale;
}

export class CreatePostDto {
  @ApiProperty()
  preview: string;

  @ApiProperty({ type: [Number] })
  tags: TagsId;

  @ApiProperty()
  isVisible: boolean;

  @ApiProperty({ type: [PostData] })
  postData;
}
