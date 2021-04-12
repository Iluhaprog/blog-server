import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../project.entity';
import { User } from '../../user/user.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { ProjectData } from '../project.data.entity';

describe('Project entity', () => {
  const projectToken = getRepositoryToken(Project);
  const projectDataToken = getRepositoryToken(ProjectData);
  const userToken = getRepositoryToken(User);
  const user = {
    about: '',
    avatar: '',
    login: 'test',
    firstName: '',
    lastName: '',
    email: 'asdas@asda.aom',
    password: '12345678',
  };
  const project = {
    projectData: [],
    preview: 'test',
    projectLink: 'project link',
    githubLink: 'github link',
  };
  let projectRepo: Repository<Project>;
  let projectDataRepo: Repository<ProjectData>;
  let userRepo: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    projectRepo = module.get(projectToken);
    projectDataRepo = module.get(projectDataToken);
    userRepo = module.get(userToken);
  });

  it('Should return undefined', async () => {
    expect(await projectRepo.findOne()).toBe(undefined);
  });

  it('Should create project', async () => {
    const savedUser = await userRepo.save(userRepo.create(user));
    const savedProject = await projectRepo.save(
      projectRepo.create({
        ...project,
        user: { id: savedUser.id },
      }),
    );
    await userRepo.delete(savedUser.id);
    expect(!!savedProject.id).toBe(true);
    expect(savedProject.user.id).toBe(savedUser.id);
  });

  it('Should delete project', async () => {
    const savedProjectData = await projectDataRepo.save({
      title: '',
      description: '',
    });
    const savedProject = await projectRepo.save(
      projectRepo.create({
        ...project,
        projectData: [savedProjectData],
      }),
    );
    await projectRepo.delete(savedProject.id);
    expect(await projectRepo.findOne(savedProject.id)).toBe(undefined);
  });
});
