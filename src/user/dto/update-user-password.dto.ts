import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;

  @ApiProperty()
  newPasswordRepeat: string;
}
