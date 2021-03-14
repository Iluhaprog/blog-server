import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DirectoryService } from './directory.service';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateDirectoryDto } from './dto/create-directory.dto';

@ApiTags('directory')
@Controller('directory')
export class DirectoryController {
  constructor(private readonly dirService: DirectoryService) {}

  @Get(':page/:limit')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return all directories' })
  async getAll(
    @Param('page') page: number,
    @Param('limit') limit: number,
  ): Promise<any> {
    return await this.dirService.getAll(+page, +limit);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Directory created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Body() dir: CreateDirectoryDto): Promise<void> {
    await this.dirService.create(dir);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Directory removed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.dirService.remove(+id);
  }
}
