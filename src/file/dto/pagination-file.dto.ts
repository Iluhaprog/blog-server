import { ApiProperty } from '@nestjs/swagger';
import { File } from '../file.entity';

export class FilePagination {
    @ApiProperty({ type: File, isArray: true })
    data: File[];

    @ApiProperty()
    total: number;
}