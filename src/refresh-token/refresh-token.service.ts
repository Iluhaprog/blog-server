import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { Moment } from "moment";

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  isValid(expireIn: Moment) {
    return expireIn.isAfter(moment(new Date()));
  }

  async get(token: string): Promise<RefreshToken | undefined> {
    return this.refreshTokenRepository.findOne({
      where: {
        token,
      },
    });
  }

  async create(userId: number): Promise<RefreshToken | undefined> {
    const token = this.refreshTokenRepository.create({
      expireIn: new Date(moment(new Date()).add(1, 'M').valueOf()),
      token: uuid(),
      user: { id: userId },
    });
    return await this.refreshTokenRepository.save(token);
  }

  async remove(token: string, userId: number): Promise<void> {
    await this.refreshTokenRepository.delete({ token, user: { id: userId } });
  }

  async removeByUserId(userId: number): Promise<void> {
    await this.refreshTokenRepository.delete({ user: { id: userId } });
  }
}
