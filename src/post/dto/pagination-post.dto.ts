import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '../type/post.type';

export class PostPagination {
  @ApiProperty({ type: PostType, isArray: true })
  data: PostType[];

  @ApiProperty()
  total: number;
}
