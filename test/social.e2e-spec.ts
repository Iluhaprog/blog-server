import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { UserService } from '../src/user/user.service';
import { getConnectionManager, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { SocialService } from '../src/social/social.service';
import { Social } from '../src/social/social.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateSocialDto } from '../src/social/dto/create-social.dto';
import { createAndLoginUser } from './helpers';
import { UpdateSocialDto } from '../src/social/dto/update-social.dto';

describe('SocialController (e2e)', () => {
  const userRepoToken = getRepositoryToken(User);
  const socialRepoToken = getRepositoryToken(Social);
  const social: CreateSocialDto = {
    link: 'TEST_LINK',
    preview: 'TEST_PREVIEW',
    title: 'TEST_TILE',
  };
  let userService: UserService;
  let userRepo: Repository<User>;
  let socialRepo: Repository<Social>;
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
        SocialService,
        {
          provide: socialRepoToken,
          useClass: Repository,
        },
        {
          provide: userRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    socialRepo = moduleFixture.get(socialRepoToken);
    userRepo = moduleFixture.get(userRepoToken);
    userService = moduleFixture.get<UserService>(UserService);
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnectionManager().get('default');
    await defaultConnection.close();
  });

  it('/social (GET)', async () => {
    const newSocial = await socialRepo.save(social);
    const { status, body } = await request(app.getHttpServer()).get('/social');

    await socialRepo.delete(newSocial.id);

    expect(status).toBe(HttpStatus.OK);
    expect(body).toEqual([newSocial]);
  });

  it('/social (POST)', async () => {
    const login = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';
    const token = await createAndLoginUser(
      login,
      password,
      userService,
      request,
      app,
    );

    const { status } = await request(app.getHttpServer())
      .post('/social')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(social);

    const createdSocial = await socialRepo.findOne();
    await socialRepo.delete(createdSocial.id);
    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.CREATED);
    expect(!!createdSocial).toBe(true);
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
    const newSocial = await socialRepo.save(social);
    const newTitle = newSocial.title + '_U';
    const updatedSocial: UpdateSocialDto = {
      id: newSocial.id,
      link: newSocial.link,
      preview: newSocial.preview,
      title: newTitle,
    };

    const { status } = await request(app.getHttpServer())
      .put('/social')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(updatedSocial);

    const updated = await socialRepo.findOne(updatedSocial.id);

    await userRepo.delete(token.userId);
    await socialRepo.delete(updated.id);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(updated.title).toBe(newTitle);
  });

  it('/social (DELETE)', async () => {
    const login = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';
    const token = await createAndLoginUser(
      login,
      password,
      userService,
      request,
      app,
    );
    const newSocial = await socialRepo.save(social);

    const { status } = await request(app.getHttpServer())
      .delete(`/social/${newSocial.id}`)
      .auth(token.access, { type: 'bearer' });

    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(await socialRepo.findOne(newSocial.id)).toBe(undefined);
  });
});
