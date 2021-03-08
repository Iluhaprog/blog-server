import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Social } from './social.entity';
import { SocialService } from './social.service';

@Module({
  imports: [TypeOrmModule.forFeature([Social])],
  providers: [SocialService],
})
export class SocialModule {}
