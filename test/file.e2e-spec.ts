import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { FileService } from '../src/file/file.service';
import { UserService } from '../src/user/user.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { getConnectionManager, Repository } from 'typeorm';
import { File } from '../src/file/file.entity';
import * as request from 'supertest';
import { createAndLoginUser } from './helpers';
import { Directory } from '../src/directory/directory.entity';

describe('FileController (e2e)', () => {
  const userRepoToken = getRepositoryToken(User);
  const fileRepoToken = getRepositoryToken(File);
  const dirRepoToken = getRepositoryToken(Directory);
  let fileService: FileService;
  let userService: UserService;
  let userRepo: Repository<User>;
  let fileRepo: Repository<File>;
  let dirRepo: Repository<Directory>;
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
        FileService,
        {
          provide: userRepoToken,
          useClass: Repository,
        },
        {
          provide: fileRepoToken,
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
    fileService = moduleFixture.get<FileService>(FileService);
    fileRepo = moduleFixture.get(fileRepoToken);
    dirRepo = moduleFixture.get(dirRepoToken);
    userRepo = moduleFixture.get(userRepoToken);
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnectionManager().get('default');
    await defaultConnection.close();
  });

  it('/file/0/1 (GET)', async () => {
    const file = new File();
    const response = {
      data: [file],
      total: 1,
    };
    jest.spyOn(fileService, 'getAll').mockResolvedValueOnce(response);

    const { body } = await request(app.getHttpServer()).get('/file/0/1');

    expect(body).toEqual(response);
    expect(fileService.getAll).toHaveBeenCalled();
    expect(fileService.getAll).toBeCalledWith(0, 1);
  });

  it('/file (POST)', async () => {
    const username = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';

    const token = await createAndLoginUser(
      username,
      password,
      userService,
      request,
      app,
    );

    const dir = await dirRepo.save({ name: 'test' });

    let status;
    let body;

    try {
      const response = await request(app.getHttpServer())
        .post('/file')
        .query({ dir: dir.id })
        .attach('file', __dirname + '/attached-files/file.txt')
        .auth(token.access, { type: 'bearer' });

      status = response.status;
      body = response.body;
    } catch (e) {
      console.error(e);
    }
    const file = await fileRepo.findOne({ where: { name: 'file.txt' } });

    await dirRepo.delete(dir.id);
    await userRepo.delete(token.userId);

    expect(!!body.id).toBe(true);
    expect(status).toBe(HttpStatus.CREATED);
    expect(!!file).toBe(true);
  });

  it('/file (DELETE)', async () => {
    const username = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';

    const token = await createAndLoginUser(
      username,
      password,
      userService,
      request,
      app,
    );
    const dir = await dirRepo.save({ name: 'test' });
    const file = await fileRepo.save({
      name: 'test',
      directory: { id: dir.id },
    });

    const { status } = await request(app.getHttpServer())
      .delete(`/file/${file.id}`)
      .auth(token.access, { type: 'bearer' });

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(await fileRepo.findOne(file.id)).toBe(undefined);

    await dirRepo.delete(dir.id);
    await userRepo.delete(token.userId);
  });
});
