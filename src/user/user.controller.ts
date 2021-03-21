import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOkResponse({ description: 'Return user', type: User })
  @ApiBadRequestResponse({ description: 'Uncorrected id' })
  async findById(@Param('id') id: number): Promise<User> {
    return await this.userService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'User has been created' })
  @ApiBadRequestResponse({ description: 'Uncorrected user data' })
  async create(@Body() user: CreateUserDto): Promise<void> {
    await this.userService.create(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'User has been updated' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async update(@Body() user: UpdateUserDto): Promise<void> {
    await this.userService.update(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'User password has been updated' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updatePassword(@Body() user: UpdateUserPasswordDto): Promise<void> {
    await this.userService.updatePassword(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'User has been deleted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param() id: number): Promise<void> {
    await this.userService.remove(id);
  }
}
