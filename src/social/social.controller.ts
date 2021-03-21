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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Order } from '../types/order.type';

@ApiTags('social')
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get(':order')
  @ApiOkResponse({ description: 'Returned all socials', type: Social })
  @ApiParam({ name: 'order', enum: ['ASC', 'DESC'] })
  async getAll(
    @Param('order') order: Order,
  ): Promise<Social[] | any[] | undefined> {
    return await this.socialService.getAll(order);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Social has been created', type: Social })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Request() req, @Body() social: CreateSocialDto): Promise<any> {
    const userId = req.user.id;
    return await this.socialService.create(social, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Social has been updated' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async update(@Body() social: UpdateSocialDto): Promise<void> {
    await this.socialService.update(social);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Social has been removed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param() id: number): Promise<void> {
    await this.socialService.remove(id);
  }
}
