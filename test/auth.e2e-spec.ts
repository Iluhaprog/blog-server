import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { User } from '../src/user/user.entity';
import { UserService } from '../src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { getConnectionManager } from 'typeorm';
import { query } from 'express';

async function createUser(login, password, service: UserService) {
  const user: CreateUserDto = {
    about: '',
    avatar: '',
    email: 'TEST_EMAIL@TEST.TEST',
    firstName: '',
    lastName: '',
    login,
    password,
  };
  return await service.create(user);
}

describe('AuthController (e2e)', () => {
  const repoToken = getRepositoryToken(User);
  let app: INestApplication;
  let service: UserService;

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
          provide: repoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<UserService>(UserService);
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnectionManager().get('default');
    await defaultConnection.close();
  });

  it('/auth/login (POST) success', async () => {
    const username = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';

    await createUser(username, password, service);
    const user: User = await service.findByLogin(username);

    return request(app.getHttpServer())
      .post('/auth/login')
      .query({ username })
      .query({ password })
      .expect(HttpStatus.OK)
      .then(async (response) => {
        const { accessToken, refreshToken } = response.body;
        expect(typeof accessToken).toBe('string');
        expect(typeof refreshToken).toBe('string');
      })
      .finally(async () => {
        await service.remove(user.id);
      });
  });

  it('/auth/login (POST) fail', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('/auth/refresh-token', async () => {
    const username = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';

    await createUser(username, password, service);
    const user: User = await service.findByLogin(username);
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .query({ username })
      .query({ password });
    const { accessToken, refreshToken } = body || {};
    const response = await request(app.getHttpServer())
      .get('/auth/refresh-token')
      .auth(accessToken, { type: 'bearer' })
      .query({ token: refreshToken });
    const newTokens = response.body || {};
    await service.remove(user.id);

    expect(typeof newTokens.accessToken).toBe('string');
    expect(typeof newTokens.refreshToken).toBe('string');
  });

  it('/auth/logout (GET)', async () => {
    const username = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';

    await createUser(username, password, service);
    const user: User = await service.findByLogin(username);
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .query({ username })
      .query({ password });
    const { accessToken } = body || {};
    const { status } = await request(app.getHttpServer())
      .get('/auth/logout')
      .auth(accessToken, { type: 'bearer' });
    await service.remove(user.id);

    expect(status).toBe(HttpStatus.NO_CONTENT);
  });

  it('/auth/logoutAll (GET)', async () => {
    const username = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';

    await createUser(username, password, service);
    const user: User = await service.findByLogin(username);
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .query({ username })
      .query({ password });
    const { accessToken } = body || {};
    const { status } = await request(app.getHttpServer())
      .get('/auth/logoutAll')
      .auth(accessToken, { type: 'bearer' });
    await service.remove(user.id);

    expect(status).toBe(HttpStatus.NO_CONTENT);
  });
});
