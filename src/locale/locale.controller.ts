import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { LocaleService } from './locale.service';
import { Locale } from './locale.entity';
import { AuthGuard } from "@nestjs/passport";
import { CreateLocaleDto } from "./dto/create-locale.dto";

@ApiTags('Locale')
@Controller('locale')
export class LocaleController {
  constructor(private readonly localeService: LocaleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return all Locales', type: [Locale] })
  async findAll(): Promise<Locale[]> {
    return await this.localeService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return locale by id', type: Locale })
  async findById(@Param('id') id: number): Promise<Locale> {
    return await this.localeService.findById(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Create locale', type: Locale })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Body() locale: CreateLocaleDto): Promise<Locale> {
    return await this.localeService.create(locale);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Delete locale' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('id') id: number): Promise<any> {
    await this.localeService.remove(+id);
  }
}
