import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Post,
  Body,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Order } from '../types/order.type';
import { ProjectType } from './type/project.type';
import { ProjectData } from "./project.data.entity";

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':order')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return all projects', type: [ProjectType] })
  @ApiParam({ name: 'order', enum: ['ASC', 'DESC'] })
  async findAll(
    @Param('order') order: Order,
  ): Promise<Project[] | any[] | undefined> {
    return this.projectService.findAll(order);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/addData/:localeId/:projectId')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Project has been created',
    type: ProjectData,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async addData(
    @Param('localeId') localeId: number,
    @Param('projectId') projectId: number,
  ): Promise<any> {
    return await this.projectService.addData(localeId, projectId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Project has been created',
    type: ProjectType,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(
    @Request() req,
    @Body() project: CreateProjectDto,
  ): Promise<void> {
    const userId = req.user.id;
    return await this.projectService.create(project, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Project updated' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async update(@Body() project: UpdateProjectDto): Promise<void> {
    await this.projectService.update(project);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Project removed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param() id: number): Promise<void> {
    await this.projectService.remove(id);
  }
}
