import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '../project.service';
import { Repository } from 'typeorm';
import { Project } from '../project.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

describe('ProjectService', () => {
  const projectToken = getRepositoryToken(Project);
  let service: ProjectService;
  let projectRepo: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: projectToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    projectRepo = module.get(projectToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all projects', async () => {
    const project = new Project();
    jest.spyOn(projectRepo, 'find').mockResolvedValueOnce([project]);
    const projects = await service.findAll();

    expect(projects).toEqual([project]);
    expect(projectRepo.find).toHaveBeenCalled();
  });

  it('should create project', async () => {
    const newProject: CreateProjectDto = {
      description: '',
      githubLink: '',
      preview: '',
      projectLink: '',
      title: '',
    };
    const project = new Project();
    jest.spyOn(projectRepo, 'create').mockReturnValue(new Project());
    jest.spyOn(projectRepo, 'save').mockResolvedValueOnce(project);

    await service.create(newProject);
    expect(projectRepo.create).toHaveBeenCalled();
    expect(projectRepo.create).toBeCalledWith(newProject);
    expect(projectRepo.save).toHaveBeenCalled();
    expect(projectRepo.save).toBeCalledWith(project);
  });

  it('should update project', async () => {
    const updatedProject: UpdateProjectDto = {
      id: 1,
      description: '',
      githubLink: '',
      preview: '',
      projectLink: '',
      title: '',
    };
    jest
      .spyOn(projectRepo, 'update')
      .mockResolvedValueOnce(Promise.resolve(undefined));

    await service.update(updatedProject);
    expect(projectRepo.update).toHaveBeenCalled();
    expect(projectRepo.update).toBeCalledWith(
      updatedProject.id,
      updatedProject,
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
