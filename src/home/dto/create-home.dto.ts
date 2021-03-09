import { ApiProperty } from '@nestjs/swagger';

export class CreateHomeDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
