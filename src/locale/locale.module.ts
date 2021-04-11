import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locale } from './locale.entity';
import { LocaleService } from './locale.service';
import { LocaleController } from './locale.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Locale])],
  providers: [LocaleService],
  controllers: [LocaleController],
})
export class LocaleModule {}
