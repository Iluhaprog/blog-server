import { ApiProperty } from '@nestjs/swagger';

class Locale {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

class UserDataType {
  @ApiProperty()
  about: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  locale: Locale;
}

export class CreateUserDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty({ type: [UserDataType] })
  userData: UserDataType[];
}
