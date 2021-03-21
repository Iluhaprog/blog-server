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
} from '@nestjs/common';
import {
  ApiBadRequestResponse, ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { PostPagination } from './dto/pagination-post.dto';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/by-tags')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return posts', type: [PostEntity] })
  async findByTags(@Body('tags') tags: number[]): Promise<any> {
    return await this.postService.findByTags(tags);
  }

  @Get(':page/:limit')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return posts', type: PostPagination })
  @ApiBadRequestResponse({ description: 'An uncorrected page or limit' })
  async findAll(
    @Param('page') page: number,
    @Param('limit') limit: number,
  ): Promise<any> {
    return await this.postService.findAll(+page, +limit);
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
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiNoContentResponse({ description: 'Post has been created', type: PostEntity })
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
