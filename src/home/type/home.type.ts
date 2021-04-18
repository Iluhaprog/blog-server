import { ApiProperty } from '@nestjs/swagger';

class Locale {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

class HomeDataType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  locale: Locale;
}

export class HomeType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  selected: boolean;

  @ApiProperty({ type: [HomeDataType] })
  homeData: HomeDataType[];
}
