import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from './home.entity';
import { HomeService } from './home.service';

@Module({
  imports: [TypeOrmModule.forFeature([Home])],
  providers: [HomeService],
})
export class HomeModule {}
