import { BadRequestException } from '@nestjs/common';

export class MismatchPasswordException extends BadRequestException {
  constructor() {
    super('Mismatch passwords');
  }
}
