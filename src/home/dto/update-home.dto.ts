import { ApiProperty } from '@nestjs/swagger';

export class UpdateHomeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
