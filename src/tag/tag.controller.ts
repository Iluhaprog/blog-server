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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { AuthGuard } from '@nestjs/passport';
import { Tag } from './tag.entity';
import { Order } from '../types/order.type';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get(':order')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return array of tags', type: [Tag] })
  async getAll(
    @Param('order') order: Order,
  ): Promise<Tag[] | any[] | undefined> {
    return this.tagService.getAll(order);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Tag has been created', type: Tag })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Body() tag: CreateTagDto): Promise<any> {
    return await this.tagService.create(tag);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Tag has been removed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.tagService.remove(id);
  }
}
