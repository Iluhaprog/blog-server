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
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Return all projects' })
  async findAll(): Promise<Project[] | any[] | undefined> {
    return this.projectService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Project has been created' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async create(
    @Request() req,
    @Body() project: CreateProjectDto,
  ): Promise<void> {
    const userId = req.user.id;
    await this.projectService.create(project, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Project updated' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async update(@Body() project: UpdateProjectDto): Promise<void> {
    await this.projectService.update(project);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Project removed' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async remove(@Param() id: number): Promise<void> {
    await this.projectService.remove(id);
  }
}
