import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '../../tag/tag.entity';

export class UpdatePostDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  preview: string;

  @ApiProperty({ type: [Tag] })
  tags: Tag[];

  @ApiProperty()
  description: string;

  @ApiProperty()
  isVisible: boolean;
}
