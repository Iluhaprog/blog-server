import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../dist/user/user.entity';
import { Locale } from '../dist/locale/locale.entity';
import { CreateLocaleDto } from '../dist/locale/dto/create-locale.dto';
import { UserService } from '../dist/user/user.service';
import { getConnectionManager, Repository } from 'typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { LocaleService } from '../dist/locale/locale.service';
import * as request from 'supertest';
import { createAndLoginUser } from './helpers';

describe('SocialController (e2e)', () => {
  const userRepoToken = getRepositoryToken(User);
  const localeRepoToken = getRepositoryToken(Locale);
  const locale: CreateLocaleDto = { name: 'TEST_LOCALE' };
  let userService: UserService;
  let userRepo: Repository<User>;
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
        LocaleService,
        {
          provide: localeRepoToken,
          useClass: Repository,
        },
        {
          provide: userRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    localeRepo = moduleFixture.get(localeRepoToken);
    userRepo = moduleFixture.get(userRepoToken);
    userService = moduleFixture.get<UserService>(UserService);
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnectionManager().get('default');
    await defaultConnection.close();
  });

  it('/locale (GET)', async () => {
    const newLocale = await localeRepo.save(locale);
    const { status, body } = await request(app.getHttpServer()).get('/locale');

    await localeRepo.delete(newLocale.id);

    expect(status).toBe(HttpStatus.OK);
    expect(body).toEqual([newLocale]);
  });

  it('/locale/:id (GET)', async () => {
    const newLocale = await localeRepo.save(locale);
    const { status, body } = await request(app.getHttpServer()).get(
      `/locale/${newLocale.id}`,
    );

    await localeRepo.delete(newLocale.id);

    expect(status).toBe(HttpStatus.OK);
    expect(body).toEqual(newLocale);
  });

  it('/locale (POST)', async () => {
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
      .post('/locale')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(locale);

    const createdLocale = await localeRepo.findOne();
    await localeRepo.delete(createdLocale.id);
    await userRepo.delete(token.userId);

    expect(!!body.id).toBe(true);
    expect(status).toBe(HttpStatus.CREATED);
    expect(createdLocale).toEqual(body);
  });

  it('/locale/:id (DELETE)', async () => {
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

    const { status } = await request(app.getHttpServer())
      .delete(`/locale/${newLocale.id}`)
      .auth(token.access, { type: 'bearer' });

    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(await localeRepo.findOne(newLocale.id)).toBe(undefined);

    await localeRepo.delete(newLocale.id);
  });
});
