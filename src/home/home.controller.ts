import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HomeService } from './home.service';
import { Home } from './home.entity';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('home')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return all homes' })
  async getAll(): Promise<Home[] | any[] | undefined> {
    return await this.homeService.getAll();
  }

  @Get('/one')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return last home' })
  async get(): Promise<Home | undefined> {
    return await this.homeService.get();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Create home' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async create(@Body() home: CreateHomeDto): Promise<void> {
    await this.homeService.create(home);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Home has been updated' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async update(@Body() home: UpdateHomeDto): Promise<void> {
    await this.homeService.update(home);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Home has been removed' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.homeService.remove(id);
  }
}
