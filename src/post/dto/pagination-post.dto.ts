import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../post.entity';

export class PostPagination {
    @ApiProperty({ type: Post, isArray: true })
    data: Post[];

    @ApiProperty()
    total: number;
}