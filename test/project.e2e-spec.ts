import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../src/project/project.entity';
import { User } from '../src/user/user.entity';
import { UserService } from '../src/user/user.service';
import { getConnectionManager, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { CreateProjectDto } from '../src/project/dto/create-project.dto';
import { ProjectService } from '../src/project/project.service';
import * as request from 'supertest';
import { createAndLoginUser } from './helpers';
import { UpdateProjectDto } from '../src/project/dto/update-project.dto';
import { ProjectData } from '../src/project/project.data.entity';
import { Locale } from '../dist/locale/locale.entity';
import { UserData } from '../src/user/user.data.entity';

describe('ProjectController (e2e)', () => {
  const userRepoToken = getRepositoryToken(User);
  const userDataRepoToken = getRepositoryToken(UserData);
  const projectRepoToken = getRepositoryToken(Project);
  const projectDataRepoToken = getRepositoryToken(ProjectData);
  const localeRepoToken = getRepositoryToken(Locale);
  const project: CreateProjectDto = {
    projectData: [],
    githubLink: 'TEST_GIT_LINK',
    preview: 'TEST_PREVIEW',
    projectLink: 'TEXT_PRJ_LINK',
  };
  const locale = { name: 'TEST_LOCALE' };
  const projectData = {
    title: 'TEST_PROJECT_TITLE',
    description: 'TEST_PROJECT_DESCRIPTION',
  };
  let userService: UserService;
  let projectRepo: Repository<Project>;
  let userRepo: Repository<User>;
  let projectDataRepo: Repository<ProjectData>;
  let localeRepo: Repository<Locale>;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env'],
        }),
        AppModule,
      ],
      providers: [
        UserService,
        ProjectService,
        {
          provide: projectRepoToken,
          useClass: Repository,
        },
        {
          provide: userRepoToken,
          useClass: Repository,
        },
        {
          provide: projectDataRepoToken,
          useClass: Repository,
        },
        {
          provide: localeRepoToken,
          useClass: Repository,
        },
        {
          provide: userDataRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    projectRepo = moduleFixture.get(projectRepoToken);
    userRepo = moduleFixture.get(userRepoToken);
    projectDataRepo = moduleFixture.get(projectDataRepoToken);
    localeRepo = moduleFixture.get(localeRepoToken);
    userService = moduleFixture.get<UserService>(UserService);
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnectionManager().get('default');
    await defaultConnection.close();
  });

  it('/project/:order (GET)', async () => {
    const newLocale = await localeRepo.save(locale);
    const newProjectData = await projectDataRepo.save({
      ...projectData,
      locale: { ...newLocale },
    });
    const newProject = await projectRepo.save({
      ...project,
      projectData: [newProjectData],
    });
    const { status, body } = await request(app.getHttpServer()).get(
      '/project/DESC',
    );

    await projectRepo.delete(newProject.id);
    await localeRepo.delete(newLocale.id);

    expect(status).toBe(HttpStatus.OK);
    expect(body[0].projectData).toEqual([newProjectData]);
  });

  it('/project/addData/:localeId/:projectId (POST)', async () => {
    const login = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';
    const token = await createAndLoginUser(
      login,
      password,
      userService,
      request,
      app,
    );
    const locale = await localeRepo.save({ name: 'TEST_LOCALE' });
    const savedProject = await projectRepo.save({
      ...project,
      projectData: [],
    });

    const { status, body } = await request(app.getHttpServer())
      .post(`/project/addData/${locale.id}/${savedProject.id}`)
      .auth(token.access, { type: 'bearer' });

    await localeRepo.delete(locale.id);
    await userRepo.delete(token.userId);
    await projectRepo.delete(savedProject.id);

    expect(status).toBe(HttpStatus.CREATED);
    expect(!!body.id).toBe(true);
  });

  it('/project (POST)', async () => {
    const login = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';
    const token = await createAndLoginUser(
      login,
      password,
      userService,
      request,
      app,
    );

    const { status, body } = await request(app.getHttpServer())
      .post('/project')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(project);

    const createdProject = await projectRepo.findOne();
    await projectRepo.delete(createdProject.id);
    await userRepo.delete(token.userId);

    expect(!!body.id).toBe(true);
    expect(status).toBe(HttpStatus.CREATED);
    expect(!!createdProject).toBe(true);
  });

  it('/project (PUT)', async () => {
    const login = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';
    const token = await createAndLoginUser(
      login,
      password,
      userService,
      request,
      app,
    );
    const newLocale = await localeRepo.save(locale);
    const newProjectData = await projectDataRepo.save({
      ...projectData,
      locale: { ...newLocale },
    });
    const newProject = await projectRepo.save({
      ...project,
      projectData: [newProjectData],
    });
    const newTitle = newProjectData.title + '_U';
    const updatedProject: UpdateProjectDto = {
      githubLink: newProject.githubLink,
      id: newProject.id,
      preview: newProject.preview,
      projectLink: newProject.projectLink,
      projectData: [
        {
          ...newProjectData,
          title: newTitle,
        },
      ],
    };

    const { status } = await request(app.getHttpServer())
      .put('/project')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(updatedProject);

    const updated = await projectRepo.findOne(newProject.id, {
      relations: ['projectData', 'projectData.locale'],
    });

    await userRepo.delete(token.userId);
    await projectRepo.delete(updated.id);
    await localeRepo.delete(newLocale.id);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(updated.projectData[0].title).toBe(newTitle);
  });

  it('/project (DELETE)', async () => {
    const login = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';
    const token = await createAndLoginUser(
      login,
      password,
      userService,
      request,
      app,
    );
    const newProject = await projectRepo.save(project);

    const { status } = await request(app.getHttpServer())
      .delete(`/project/${newProject.id}`)
      .auth(token.access, { type: 'bearer' });

    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(await projectRepo.findOne(newProject.id)).toBe(undefined);
  });
});
