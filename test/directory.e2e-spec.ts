import { HttpStatus, INestApplication } from '@nestjs/common';
import { UserService } from '../src/user/user.service';
import { DirectoryService } from '../src/directory/directory.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { getConnectionManager, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { Directory } from '../src/directory/directory.entity';
import * as request from 'supertest';
import { createAndLoginUser } from './helpers';
import { CreateDirectoryDto } from '../src/directory/dto/create-directory.dto';

describe('DirectoryController (e2e)', () => {
  const userRepoToken = getRepositoryToken(User);
  const dirRepoToken = getRepositoryToken(Directory);
  let app: INestApplication;
  let userService: UserService;
  let dirService: DirectoryService;

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
        DirectoryService,
        {
          provide: userRepoToken,
          useClass: Repository,
        },
        {
          provide: dirRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<UserService>(UserService);
    dirService = moduleFixture.get<DirectoryService>(DirectoryService);
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnectionManager().get('default');
    await defaultConnection.close();
  });

  it('/directory/1/1 (GET)', async () => {
    const dir: Directory = {
      id: 1,
      name: 'TEST_DIR',
      files: [],
    };
    const response = {
      data: [dir],
      total: 1,
    };
    jest.spyOn(dirService, 'getAll').mockResolvedValueOnce(response);

    const { status, body } = await request(app.getHttpServer()).get(
      '/directory/1/1',
    );

    expect(status).toBe(HttpStatus.OK);
    expect(body).toEqual(response);
    expect(dirService.getAll).toHaveBeenCalled();
    expect(dirService.getAll).toBeCalledWith(1, 1);
  });

  it('/directory (POST)', async () => {
    const username = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';
    const token = await createAndLoginUser(
      username,
      password,
      userService,
      request,
      app,
    );

    const dir: CreateDirectoryDto = {
      name: 'TEST_DIR',
    };
    jest.spyOn(dirService, 'create').mockResolvedValueOnce({ id: 1 });

    const { status, body } = await request(app.getHttpServer())
      .post('/directory')
      .auth(token.access, { type: 'bearer' })
      .send(dir);

    await userService.remove(token.userId);

    expect(!!body.id).toBe(true);
    expect(status).toBe(HttpStatus.CREATED);
    expect(dirService.create).toHaveBeenCalled();
    expect(dirService.create).toBeCalledWith(dir);
  });

  it('/directory (DELETE)', async () => {
    const username = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';
    const token = await createAndLoginUser(
      username,
      password,
      userService,
      request,
      app,
    );
    const dirId = 1;

    jest.spyOn(dirService, 'remove').mockResolvedValueOnce(undefined);

    const { status } = await request(app.getHttpServer())
      .delete(`/directory/${dirId}`)
      .auth(token.access, { type: 'bearer' });

    await userService.remove(token.userId);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(dirService.remove).toHaveBeenCalled();
    expect(dirService.remove).toBeCalledWith(dirId);
  });
});
