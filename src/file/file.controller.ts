import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileService } from './file.service';
import { File } from './file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFile } from '../decorators/api-file.decorator';
import { FilePagination } from './dto/pagination-file.dto';
import { Order } from '../types/order.type';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':page/:limit/:order')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return all files', type: FilePagination })
  async getAll(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Param('order') order: Order,
  ): Promise<any> {
    return await this.fileService.getAll(+page, +limit, order);
  }

  @Get('/by-dir/:dirId/:order')
  @HttpCode(HttpStatus.OK)
  async getByDirId(
    @Param('dirId') dirId: number,
    @Param('order') order: Order,
  ): Promise<any> {
    return await this.fileService.getByDirId(+dirId, order);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @ApiFile('file')
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'File created', type: File })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(
    @Query('dir') dirId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const fileData: CreateFileDto = {
      directory: { id: dirId },
      name: file.originalname,
    };
    return await this.fileService.create(fileData);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'File removed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.fileService.remove(id);
  }
}
