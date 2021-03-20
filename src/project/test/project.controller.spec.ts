import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ProjectController } from '../project.controller';
import { ProjectService } from '../project.service';
import { Project } from '../project.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

describe('ProjectController', () => {
  const repoToken = getRepositoryToken(Project);
  let controller: ProjectController;
  let service: ProjectService;
  let repo: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        ProjectService,
        {
          provide: repoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
    service = module.get<ProjectService>(ProjectService);
    repo = module.get(repoToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  it('should find all projects', async () => {
    const project = new Project();
    jest.spyOn(service, 'findAll').mockResolvedValueOnce([project]);

    const projects = await controller.findAll();

    expect(projects).toEqual([project]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should create project', async () => {
    const project: CreateProjectDto = {
      description: '',
      githubLink: '',
      preview: '',
      projectLink: '',
      title: '',
    };
    const req = { user: { id: 1 } };
    const expectedValue = new Project();
    jest.spyOn(service, 'create').mockResolvedValueOnce(expectedValue);

    const result = await controller.create(req, project);

    expect(result).toEqual(expectedValue);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toBeCalledWith(project, req.user.id);
  });

  it('should update project', async () => {
    const project: UpdateProjectDto = {
      id: 1,
      description: '',
      githubLink: '',
      preview: '',
      projectLink: '',
      title: '',
    };
    jest.spyOn(service, 'update').mockResolvedValueOnce(undefined);

    await controller.update(project);

    expect(service.update).toHaveBeenCalled();
    expect(service.update).toBeCalledWith(project);
  });

  it('should remove project', async () => {
    const id = 1;
    jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

    await controller.remove(id);

    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toBeCalledWith(id);
  });
});
