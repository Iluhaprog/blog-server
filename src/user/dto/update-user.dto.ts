import { ApiProperty } from '@nestjs/swagger';

class UserData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  about: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

export class UpdateUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  login: string;

  @ApiProperty()
  userData: UserData[];

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatar: string;
}
