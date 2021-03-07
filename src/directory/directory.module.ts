import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Directory } from './directory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Directory])],
})
export class DirectoryModule {}
