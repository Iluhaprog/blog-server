import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  directory: {
    id: number;
  };
}
