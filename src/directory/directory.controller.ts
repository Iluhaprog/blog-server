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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateDirectoryDto } from './dto/create-directory.dto';
import { Directory } from './directory.entity';

@ApiTags('directory')
@Controller('directory')
export class DirectoryController {
  constructor(private readonly dirService: DirectoryService) {}

  @Get(':page/:limit')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return all directories', type: [Directory] })
  async getAll(
    @Param('page') page: number,
    @Param('limit') limit: number,
  ): Promise<any> {
    return await this.dirService.getAll(+page, +limit);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Directory created', type: Directory })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Body() dir: CreateDirectoryDto): Promise<any> {
    return await this.dirService.create(dir);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Directory removed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.dirService.remove(+id);
  }
}
