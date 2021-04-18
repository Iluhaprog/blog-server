import { ApiProperty } from '@nestjs/swagger';

class Locale {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

class PostDataType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  locale: Locale;
}

export class PostType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  isVisible: boolean;

  @ApiProperty()
  preview: string;

  @ApiProperty()
  creationDate: Date;

  @ApiProperty({ type: [PostDataType] })
  postData: PostDataType[];
}
