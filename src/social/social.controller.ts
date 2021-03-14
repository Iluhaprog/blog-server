import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Put,
  HttpStatus,
  HttpCode,
  Delete,
  Param,
} from '@nestjs/common';
import { SocialService } from './social.service';
import { Social } from './social.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('social')
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get()
  @ApiOkResponse({ description: 'Returned all socials' })
  async getAll(): Promise<Social[] | any[] | undefined> {
    return await this.socialService.getAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Social has been created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Request() req, @Body() social: CreateSocialDto): Promise<void> {
    const userId = req.user.id;
    await this.socialService.create(social, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Social has been updated' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async update(@Body() social: UpdateSocialDto): Promise<void> {
    await this.socialService.update(social);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Social has been removed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param() id: number): Promise<void> {
    await this.socialService.remove(id);
  }
}
