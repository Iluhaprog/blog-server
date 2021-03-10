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
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOkResponse({ description: 'Return user' })
  @ApiBadRequestResponse({ description: 'Uncorrected id' })
  async findById(@Param('id') id: number): Promise<User> {
    return await this.userService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'User has been created' })
  @ApiBadRequestResponse({ description: 'Uncorrected user data' })
  async create(@Body() user: CreateUserDto): Promise<void> {
    await this.userService.create(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'User has been updated' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async update(@Body() user: UpdateUserDto): Promise<void> {
    await this.userService.update(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'User password has been updated' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async updatePassword(@Body() user: UpdateUserPasswordDto): Promise<void> {
    await this.userService.updatePassword(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'User has been deleted' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async remove(@Param() id: number): Promise<void> {
    await this.userService.remove(id);
  }
}
