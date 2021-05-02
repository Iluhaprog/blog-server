import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { UserService } from '../user/user.service';
import { LocaleService } from '../locale/locale.service';
import { User } from '../user/user.entity';
import { Locale } from '../locale/locale.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from '../user/user.data.entity';
import { NewConsoleService } from './new-console.service';
import { AppModule } from '../app.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserData, Locale]),
    ConsoleModule,
    AppModule,
  ],
  providers: [NewConsoleService, UserService, LocaleService],
  exports: [NewConsoleService],
})
export class NewConsoleModule {}
