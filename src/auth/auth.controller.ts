import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

class Tokens {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBasicAuth()
  @UseGuards(AuthGuard('basic'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Return refresh and access tokens',
    type: Tokens,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Return new pair of refresh and access tokens',
    type: Tokens,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async refreshToken(
    @Query('token') token: string,
    @Request() req,
  ): Promise<any> {
    return this.authService.refresh(token, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Deleted refresh token from query' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async logout(@Query('token') token: string, @Request() req): Promise<any> {
    await this.authService.logout(token, req.user.id);
    req.logout();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('logoutAll')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Deleted all refresh tokens of user' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async logoutAll(@Request() req): Promise<any> {
    await this.authService.logoutAll(req.user.id);
    req.logout();
  }
}
