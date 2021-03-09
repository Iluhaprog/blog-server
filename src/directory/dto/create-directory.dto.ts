import { ApiProperty } from '@nestjs/swagger';

export class CreateDirectoryDto {
  @ApiProperty()
  name: string;
}
