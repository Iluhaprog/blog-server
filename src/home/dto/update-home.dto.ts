import { ApiProperty } from '@nestjs/swagger';

class HomeDataUT {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}

export class UpdateHomeDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: [HomeDataUT] })
  homeData: HomeDataUT[];
}
