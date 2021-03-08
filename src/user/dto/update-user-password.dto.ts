export class UpdateUserPasswordDto {
  id: number;
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
}
