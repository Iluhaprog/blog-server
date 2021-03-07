import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Social } from './social.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Social])],
})
export class SocialModule {}
