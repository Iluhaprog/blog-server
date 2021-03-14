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
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TagService } from './tag.service';
import { User } from '../user/user.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return array of tags' })
  async getAll(): Promise<User[] | any[] | undefined> {
    return this.tagService.getAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Tag has been created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Body() tag: CreateTagDto): Promise<void> {
    await this.tagService.create(tag);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Tag has been removed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.tagService.remove(id);
  }
}
