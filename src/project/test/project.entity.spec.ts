import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../project.entity';
import { User } from '../../user/user.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('Project entity', () => {
  const projectToken = getRepositoryToken(Project);
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
    title: 'test',
    description: '',
    preview: 'test',
    projectLink: 'project link',
    githubLink: 'github link',
  };
  let projectRepo: Repository<Project>;
  let userRepo: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    projectRepo = module.get(projectToken);
    userRepo = module.get(userToken);
  });

  it('Should return undefined', async () => {
    expect(await projectRepo.findOne()).toBe(undefined);
  });

  it('Should create project', async () => {
    const savedUser = await userRepo.save(await userRepo.create(user));
    const savedProject = await projectRepo.save(
      await projectRepo.create({
        ...project,
        user: { id: savedUser.id },
      }),
    );
    await userRepo.delete(savedUser.id);
    expect(!!savedProject.id).toBe(true);
    expect(savedProject.user.id).toBe(savedUser.id);
  });

  it('Should delete project', async () => {
    const savedProject = await projectRepo.save(
      await projectRepo.create(project),
    );
    await projectRepo.delete(savedProject.id);
    expect(await projectRepo.findOne(savedProject)).toBe(undefined);
  });

  it('Should title unique', async () => {
    let error;
    let p1;
    try {
      p1 = await projectRepo.save(await projectRepo.create(project));
      await projectRepo.save(await projectRepo.create(project));
    } catch (e) {
      error = e;
    }
    projectRepo.delete(p1.id);
    expect(error instanceof Error).toBe(true);
  });
});
