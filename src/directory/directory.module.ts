import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Directory } from './directory.entity';
import { DirectoryService } from './directory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Directory])],
  providers: [DirectoryService],
})
export class DirectoryModule {}
