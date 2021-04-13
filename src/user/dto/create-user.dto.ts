import { ApiProperty } from '@nestjs/swagger';

class UserData {
  @ApiProperty()
  about: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

export class CreateUserDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  userData: UserData[];

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatar: string;
}
