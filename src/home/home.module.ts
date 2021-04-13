import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from './home.entity';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { HomeData } from './home.data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Home, HomeData])],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
