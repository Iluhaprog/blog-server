import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from './home.entity';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Home])],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
