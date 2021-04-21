import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '../project.service';
import { Repository } from 'typeorm';
import { Project } from '../project.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectData } from '../project.data.entity';

describe('ProjectService', () => {
  const projectToken = getRepositoryToken(Project);
  const projectDataToken = getRepositoryToken(ProjectData);
  let service: ProjectService;
  let projectRepo: Repository<Project>;
  let projectDataRepo: Repository<ProjectData>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: projectToken,
          useClass: Repository,
        },
        {
          provide: projectDataToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    projectRepo = module.get(projectToken);
    projectDataRepo = module.get(projectDataToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(projectRepo).toBeDefined();
    expect(projectDataRepo).toBeDefined();
  });

  it('should add project data', async () => {
    const project = new Project();
    const projectData = new ProjectData();
    const [localeId, projectId] = [1, 1];
    jest.spyOn(projectRepo, 'findOne').mockResolvedValueOnce(project);
    jest.spyOn(projectRepo, 'save').mockResolvedValueOnce(project);
    jest.spyOn(projectDataRepo, 'save').mockResolvedValueOnce(projectData);

    const result = await service.addData(localeId, projectId);

    expect(result).toEqual(projectData);
    expect(projectRepo.findOne).toHaveBeenCalled();
    expect(projectRepo.findOne).toBeCalledWith(projectId);
    expect(projectRepo.save).toHaveBeenCalled();
    expect(projectRepo.save).toBeCalledWith({
      ...project,
      projectData: [projectData],
    });
    expect(projectDataRepo.save).toHaveBeenCalled();
    expect(projectDataRepo.save).toBeCalledWith({
      title: '',
      description: '',
      locale: { id: localeId },
    });
  });

  it('should find all projects', async () => {
    const project = new Project();
    jest.spyOn(projectRepo, 'find').mockResolvedValueOnce([project]);
    const projects = await service.findAll('DESC');

    expect(projects).toEqual([project]);
    expect(projectRepo.find).toHaveBeenCalled();
    expect(projectRepo.find).toBeCalledWith({
      relations: ['projectData', 'projectData.locale'],
      order: { id: 'DESC' },
    });
  });

  it('should create project', async () => {
    const newProject: CreateProjectDto = {
      githubLink: '',
      preview: '',
      projectLink: '',
      projectData: [],
    };
    const userId = 1;
    const project = new Project();
    jest.spyOn(projectRepo, 'create').mockReturnValue(new Project());
    jest.spyOn(projectRepo, 'save').mockResolvedValueOnce(project);
    jest.spyOn(projectRepo, 'findOne').mockResolvedValueOnce(project);

    const result = await service.create(newProject, userId);
    expect(result).toEqual(project);
    expect(projectRepo.create).toHaveBeenCalled();
    expect(projectRepo.create).toBeCalledWith({
      ...newProject,
      user: { id: userId },
    });
    expect(projectRepo.save).toHaveBeenCalled();
    expect(projectRepo.save).toBeCalledWith(project);
  });

  it('should update project', async () => {
    const updatedProject: UpdateProjectDto = {
      id: 1,
      githubLink: '',
      preview: '',
      projectLink: '',
      projectData: [new ProjectData()],
    };
    jest
      .spyOn(projectRepo, 'save')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    jest
      .spyOn(projectDataRepo, 'save')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    jest.spyOn(projectDataRepo, 'create').mockReturnValue(undefined);

    await service.update(updatedProject);
    expect(projectRepo.save).toHaveBeenCalled();
    expect(projectRepo.save).toBeCalledWith(updatedProject);
    expect(projectDataRepo.save).toHaveBeenCalled();
    expect(projectDataRepo.create).toHaveBeenCalled();
    expect(projectDataRepo.create).toBeCalledWith(
      updatedProject.projectData[0],
    );
  });

  it('should remove project', async () => {
    jest
      .spyOn(projectRepo, 'delete')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    const id = 1;

    await service.remove(id);

    expect(projectRepo.delete).toHaveBeenCalled();
    expect(projectRepo.delete).toBeCalledWith(id);
  });
});
