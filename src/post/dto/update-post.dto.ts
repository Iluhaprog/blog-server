import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '../../tag/tag.entity';
import { PostData } from '../post.data.entity';

export class UpdatePostDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  preview: string;

  @ApiProperty({ type: [Tag] })
  tags: Tag[];

  @ApiProperty()
  isVisible: boolean;

  @ApiProperty({ type: [PostData] })
  postData: PostData[];
}
