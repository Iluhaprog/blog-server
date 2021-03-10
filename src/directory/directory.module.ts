import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Directory } from './directory.entity';
import { DirectoryService } from './directory.service';
import { DirectoryController } from './directory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Directory])],
  providers: [DirectoryService],
  controllers: [DirectoryController],
})
export class DirectoryModule {}
