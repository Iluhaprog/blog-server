import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/user/user.entity';
import { UserService } from '../src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { getConnectionManager } from 'typeorm';
import { createUser, createAndLoginUser } from './helpers';

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

    const token = await createAndLoginUser(
      username,
      password,
      service,
      request,
      app,
    );
    const response = await request(app.getHttpServer())
      .get('/auth/refresh-token')
      .auth(token.access, { type: 'bearer' })
      .query({ token: token.refresh });
    const newTokens = response.body || {};
    await service.remove(token.userId);

    expect(typeof newTokens.accessToken).toBe('string');
    expect(typeof newTokens.refreshToken).toBe('string');
  });

  it('/auth/logout (GET)', async () => {
    const username = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';

    const token = await createAndLoginUser(
      username,
      password,
      service,
      request,
      app,
    );
    const { status } = await request(app.getHttpServer())
      .get('/auth/logout')
      .auth(token.access, { type: 'bearer' });
    await service.remove(token.userId);

    expect(status).toBe(HttpStatus.NO_CONTENT);
  });

  it('/auth/logoutAll (GET)', async () => {
    const username = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';

    const token = await createAndLoginUser(
      username,
      password,
      service,
      request,
      app,
    );
    const { status } = await request(app.getHttpServer())
      .get('/auth/logoutAll')
      .auth(token.access, { type: 'bearer' });
    await service.remove(token.userId);

    expect(status).toBe(HttpStatus.NO_CONTENT);
  });
});
