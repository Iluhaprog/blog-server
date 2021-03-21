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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
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
  @ApiOkResponse({ description: 'Return all homes', type: [Home] })
  async getAll(): Promise<Home[] | any[] | undefined> {
    return await this.homeService.getAll();
  }

  @Get('/one')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return one selected home', type: Home })
  async get(): Promise<Home | undefined> {
    return await this.homeService.get();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Create home', type: Home })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Body() home: CreateHomeDto): Promise<any> {
    return await this.homeService.create(home);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Home has been updated' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async update(@Body() home: UpdateHomeDto): Promise<void> {
    await this.homeService.update(home);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Home has been removed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.homeService.remove(id);
  }
}
