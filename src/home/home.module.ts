import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from './home.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Home])],
})
export class HomeModule {}
