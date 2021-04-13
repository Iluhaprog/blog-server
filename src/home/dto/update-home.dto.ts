import { ApiProperty } from '@nestjs/swagger';

class HomeData {
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

  @ApiProperty()
  homeData: HomeData[];
}
