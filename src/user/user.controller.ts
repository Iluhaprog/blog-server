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
  Request,
  UseGuards,
  Req,
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
import { UserType } from './type/user.type';
import { UserData } from './user.data.entity';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/current')
  @ApiOkResponse({ description: 'Return user', type: UserType })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getCurrent(@Req() req): Promise<User> {
    return await this.userService.findById(req.user.id);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Return user', type: UserType })
  @ApiBadRequestResponse({ description: 'Uncorrected id' })
  async findById(@Param('id') id: number): Promise<User> {
    return await this.userService.findById(id);
  }

  @Get()
  @ApiOkResponse({ description: 'Return user', type: UserType })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async findAll(): Promise<any> {
    return await this.userService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/addData/:localeId')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'UserData has been created',
    type: UserData,
  })
  @ApiBadRequestResponse({ description: 'Uncorrected user data' })
  async addData(@Param('localeId') localeId, @Request() req): Promise<any> {
    await this.userService.addData(localeId, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'User has been created', type: UserType })
  @ApiBadRequestResponse({ description: 'Uncorrected user data' })
  async create(@Body() user: CreateUserDto): Promise<any> {
    return await this.userService.create(user);
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
