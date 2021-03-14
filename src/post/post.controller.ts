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
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/by-tags')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return posts' })
  async findByTags(@Body('tags') tags: number[]): Promise<any> {
    return await this.postService.findByTags(tags);
  }

  @Get(':page/:limit')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return posts' })
  @ApiBadRequestResponse({ description: 'An uncorrected page or limit' })
  async findAll(
    @Param('page') page: number,
    @Param('limit') limit: number,
  ): Promise<any> {
    return await this.postService.findAll(+page, +limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return post by id' })
  @ApiBadRequestResponse({ description: 'An uncorrected id' })
  async findById(@Param('id') id: number): Promise<PostEntity | undefined> {
    return await this.postService.findById(id);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return last posts' })
  async findLast(): Promise<PostEntity[] | [] | undefined> {
    return await this.postService.findLast();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiNoContentResponse({ description: 'Post has been created' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async create(@Request() req, @Body() post: CreatePostDto): Promise<void> {
    const userId = req.user.id;
    await this.postService.create(post, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Post has been updated' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async update(@Body() post: UpdatePostDto): Promise<void> {
    await this.postService.update(post);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Post has been removed' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.postService.remove(id);
  }
}
