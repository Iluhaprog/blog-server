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
import { Locale } from '../dist/locale/locale.entity';
import { HomeData } from '../src/home/home.data.entity';
import { UserData } from '../src/user/user.data.entity';

describe('HomeController (e2e)', () => {
  const homeRepoToken = getRepositoryToken(Home);
  const userRepoToken = getRepositoryToken(User);
  const userDataRepoToken = getRepositoryToken(UserData);
  const localeRepoToken = getRepositoryToken(Locale);
  const homeDataRepoToken = getRepositoryToken(HomeData);
  const locale = { name: 'TEST_LOCALE' };
  const homeData = {
    title: 'TEST_TITLE',
    description: 'TEST_DESCRIPTION',
  };
  let homeRepo: Repository<Home>;
  let userRepo: Repository<User>;
  let localeRepo: Repository<Locale>;
  let homeDataRepo: Repository<HomeData>;
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
        {
          provide: homeDataRepoToken,
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
    homeRepo = moduleFixture.get(homeRepoToken);
    userRepo = moduleFixture.get(userRepoToken);
    localeRepo = moduleFixture.get(localeRepoToken);
    homeDataRepo = moduleFixture.get(homeDataRepoToken);
    userService = moduleFixture.get<UserService>(UserService);
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnectionManager().get('default');
    await defaultConnection.close();
  });

  it('/home (GET)', async () => {
    const savedLocale = await localeRepo.save(locale);
    const savedHomeData = await homeDataRepo.save({
      ...homeData,
      locale: { ...savedLocale },
    });
    const home = await homeRepo.save({
      homeData: [savedHomeData],
    });

    const { status, body } = await request(app.getHttpServer()).get('/home');

    await homeRepo.delete(home.id);
    await localeRepo.delete(savedLocale.id);

    expect(status).toBe(HttpStatus.OK);
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toEqual(home);
  });

  it('/home/one (GET)', async () => {
    const savedLocale = await localeRepo.save(locale);
    const savedHomeData = await homeDataRepo.save({
      ...homeData,
      locale: { ...savedLocale },
    });
    const home = await homeRepo.save({
      selected: true,
      homeData: [savedHomeData],
    });

    const { status, body } = await request(app.getHttpServer()).get(
      '/home/one',
    );

    await homeRepo.delete(home.id);
    await localeRepo.delete(savedLocale.id);

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

    const { status, body } = await request(app.getHttpServer())
      .post('/home')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send({
        homeData: [homeData],
      });
    const home = await homeRepo.findOne();
    await homeRepo.delete(home.id);
    await userRepo.delete(token.userId);

    expect(!!body.id).toBe(true);
    expect(status).toBe(HttpStatus.CREATED);
    expect(!!home).toBe(true);
    expect(body.homeData.length).toBe(1);
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

    const savedLocale = await localeRepo.save(locale);
    const savedHomeData = await homeDataRepo.save({
      ...homeData,
      locale: { ...savedLocale },
    });
    const home = await homeRepo.save({
      selected: true,
      homeData: [savedHomeData],
    });

    const newTitle = 'NEW_TITLE';

    const { status } = await request(app.getHttpServer())
      .put('/home')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send({
        ...home,
        homeData: [
          {
            ...savedHomeData,
            title: newTitle,
          },
        ],
      });

    const updatedHome = await homeRepo.findOne(home.id, {
      relations: ['homeData'],
    });
    await homeRepo.delete(home.id);
    await userRepo.delete(token.userId);
    await localeRepo.delete(savedLocale.id);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(updatedHome.homeData[0].title).toEqual(newTitle);
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
      homeData: [],
    });

    const { status } = await request(app.getHttpServer())
      .delete(`/home/${home.id}`)
      .auth(token.access, { type: 'bearer' });

    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(await homeRepo.findOne(home.id)).toBe(undefined);
  });
});
