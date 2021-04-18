import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ProjectController } from '../project.controller';
import { ProjectService } from '../project.service';
import { Project } from '../project.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectData } from '../project.data.entity';

describe('ProjectController', () => {
  const repoToken = getRepositoryToken(Project);
  const projectDataToken = getRepositoryToken(ProjectData);
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
        {
          provide: projectDataToken,
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

  it('should add project data', async () => {
    const projectData = new ProjectData();
    const [localeId, projectId] = [1, 1];
    jest.spyOn(service, 'addData').mockResolvedValueOnce(projectData);

    const result = await controller.addData(localeId, projectId);

    expect(result).toEqual(projectData);
    expect(service.addData).toHaveBeenCalled();
    expect(service.addData).toBeCalledWith(localeId, projectId);
  });

  it('should find all projects', async () => {
    const project = new Project();
    jest.spyOn(service, 'findAll').mockResolvedValueOnce([project]);

    const projects = await controller.findAll('DESC');

    expect(projects).toEqual([project]);
    expect(service.findAll).toHaveBeenCalled();
    expect(service.findAll).toBeCalledWith('DESC');
  });

  it('should create project', async () => {
    const project: CreateProjectDto = {
      githubLink: '',
      preview: '',
      projectLink: '',
      projectData: [],
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
      githubLink: '',
      preview: '',
      projectLink: '',
      projectData: [],
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
