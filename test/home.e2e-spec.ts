import { getRepositoryToken } from '@nestjs/typeorm';
import { Home } from '../src/home/home.entity';
import { getConnectionManager, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createAndLoginUser } from './helpers';
import { UserService } from '../src/user/user.service';
import { User } from '../src/user/user.entity';

describe('HomeController (e2e)', () => {
  const homeRepoToken = getRepositoryToken(Home);
  const userRepoToken = getRepositoryToken(User);
  let homeRepo: Repository<Home>;
  let userRepo: Repository<User>;
  let userService: UserService;
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
        {
          provide: homeRepoToken,
          useClass: Repository,
        },
        {
          provide: userRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    homeRepo = moduleFixture.get(homeRepoToken);
    userRepo = moduleFixture.get(userRepoToken);
    userService = moduleFixture.get<UserService>(UserService);
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnectionManager().get('default');
    await defaultConnection.close();
  });

  it('/home (GET)', async () => {
    const home = await homeRepo.save({
      title: 'TEST_TITLE',
      description: 'TEST_DESCRIPTION',
    });

    const { status, body } = await request(app.getHttpServer()).get('/home');

    await homeRepo.delete(home.id);

    expect(status).toBe(HttpStatus.OK);
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toEqual(home);
  });

  it('/home/one (GET)', async () => {
    const home = await homeRepo.save({
      title: 'TEST_TITLE',
      description: 'TEST_DESCRIPTION',
    });

    const { status, body } = await request(app.getHttpServer()).get(
      '/home/one',
    );

    await homeRepo.delete(home.id);

    expect(status).toBe(HttpStatus.OK);
    expect(body).toEqual(home);
  });

  it('/home (POST)', async () => {
    const username = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';

    const token = await createAndLoginUser(
      username,
      password,
      userService,
      request,
      app,
    );

    const { status } = await request(app.getHttpServer())
      .post('/home')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send({
        title: 'TEST_TITLE',
        description: 'TEST_DESCRIPTION',
      });
    const home = await homeRepo.findOne();
    await homeRepo.delete(home.id);
    await userRepo.delete(token.userId);
    expect(status).toBe(HttpStatus.CREATED);
    expect(!!home).toBe(true);
  });

  it('/home (PUT)', async () => {
    const username = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';

    const token = await createAndLoginUser(
      username,
      password,
      userService,
      request,
      app,
    );

    const home = await homeRepo.save({
      title: 'TEST_TITLE',
      description: 'TEST_DESCRIPTION',
    });

    const update = {
      id: home.id,
      title: 'TEST_TITLE_NEW',
      description: 'TEST_DESCRIPTION_NEW',
    };

    const { status } = await request(app.getHttpServer())
      .put('/home')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(update);

    const updatedHome = await homeRepo.findOne(home.id);
    await homeRepo.delete(home.id);
    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(updatedHome).toEqual(update);
  });

  it('/home (DELETE)', async () => {
    const username = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';

    const token = await createAndLoginUser(
      username,
      password,
      userService,
      request,
      app,
    );

    const home = await homeRepo.save({
      title: 'TEST_TITLE',
      description: 'TEST_DESCRIPTION',
    });

    const { status } = await request(app.getHttpServer())
      .delete(`/home/${home.id}`)
      .auth(token.access, { type: 'bearer' });

    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(await homeRepo.findOne(home.id)).toBe(undefined);
  });
});
