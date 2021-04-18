import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Request,
  Post,
  Put,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { PostPagination } from './dto/pagination-post.dto';
import { Order } from '../types/order.type';
import { PostData } from './post.data.entity';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/by-tags/:page/:limit')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return posts', type: [PostEntity] })
  async findByTags(
    @Body() tags: number[],
    @Param('page') page: number,
    @Param('limit') limit: number,
  ): Promise<any> {
    return await this.postService.findByTags(tags, +page, +limit);
  }

  @Get(':page/:limit/:order')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return posts', type: PostPagination })
  @ApiBadRequestResponse({ description: 'An uncorrected page or limit' })
  @ApiParam({ name: 'order', enum: ['ASC', 'DESC'] })
  async findAll(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Param('order') order: Order,
  ): Promise<any> {
    return await this.postService.findAll(+page, +limit, order);
  }

  @Get('visible/:page/:limit/:order')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return posts', type: PostPagination })
  @ApiBadRequestResponse({ description: 'An uncorrected page or limit' })
  @ApiParam({ name: 'order', enum: ['ASC', 'DESC'] })
  async findVisible(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Param('order') order: Order,
  ): Promise<any> {
    return await this.postService.findVisible(+page, +limit, order);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return post by id', type: PostEntity })
  @ApiBadRequestResponse({ description: 'An uncorrected id' })
  async findById(@Param('id') id: number): Promise<PostEntity | undefined> {
    return await this.postService.findById(id);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return last posts', type: [PostEntity] })
  async findLast(): Promise<PostEntity[] | [] | undefined> {
    return await this.postService.findLast();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/addData/:localeId/:postId')
  @HttpCode(HttpStatus.CREATED)
  @ApiNoContentResponse({
    description: 'Post has been created',
    type: PostData,
  })
  async addData(
    @Param('localeId') localeId: number,
    @Param('postId') postId: number,
  ): Promise<any> {
    return await this.postService.addData(localeId, postId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiNoContentResponse({
    description: 'Post has been created',
    type: PostEntity,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Request() req, @Body() post: CreatePostDto): Promise<void> {
    const userId = req.user.id;
    return await this.postService.create(post, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Post has been updated' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async update(@Body() post: UpdatePostDto): Promise<void> {
    await this.postService.update(post);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Post has been removed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.postService.remove(id);
  }
}
