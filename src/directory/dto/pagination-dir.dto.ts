import { ApiProperty } from '@nestjs/swagger';
import { Directory } from '../directory.entity';

export class DirPagination {
    @ApiProperty({ type: Directory, isArray: true })
    data: Directory[];

    @ApiProperty()
    total: number;
}