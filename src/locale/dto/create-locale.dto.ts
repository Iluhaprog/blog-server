import { ApiProperty } from '@nestjs/swagger';

export class CreateLocaleDto {
  @ApiProperty()
  name: string;
}
