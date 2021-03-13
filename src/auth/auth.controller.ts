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
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return refresh and access tokens' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Return new pair of refresh and access tokens',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async refreshToken(
    @Query('token') token: string,
    @Request() req,
  ): Promise<any> {
    return this.authService.refresh(token, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Deleted refresh token from query' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async logout(@Query('token') token: string, @Request() req): Promise<any> {
    await this.authService.logout(token, req.user.id);
    req.logout();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logoutAll')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Deleted all refresh tokens of user' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async logoutAll(@Request() req): Promise<any> {
    await this.authService.logoutAll(req.user.id);
    req.logout();
  }
}
