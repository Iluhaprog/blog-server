import { ApiProperty } from '@nestjs/swagger';

class UpdateUserData {
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
  email: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty({ type: [UpdateUserData] })
  userData: UpdateUserData[];
}
