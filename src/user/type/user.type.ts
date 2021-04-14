import { ApiProperty } from '@nestjs/swagger';

class Locale {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

class UserData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  about: string;

  @ApiProperty()
  locale: Locale;
}

export class UserType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  skills: string;

  @ApiProperty({ type: [UserData] })
  userData: UserData[];
}
