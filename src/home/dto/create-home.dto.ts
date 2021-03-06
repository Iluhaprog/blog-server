import { ApiProperty } from '@nestjs/swagger';

class HomeData {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}

export class CreateHomeDto {
  @ApiProperty({ type: [HomeData] })
  homeData: HomeData[];
}
