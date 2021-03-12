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
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileService } from './file.service';
import { File } from './file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':page/:limit')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return all files' })
  async getAll(
    @Param('page') page: number,
    @Param('limit') limit: number,
  ): Promise<File[] | any[] | undefined> {
    return await this.fileService.getAll(page, limit);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'File created' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async create(
    @Query('dir') dirId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const fileData: CreateFileDto = {
      directory: { id: dirId },
      name: file.originalname,
    };
    await this.fileService.create(fileData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'File removed' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.fileService.remove(id);
  }
}
