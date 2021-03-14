import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { UserService } from '../src/user/user.service';
import { getConnectionManager, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateSocialDto } from '../src/social/dto/create-social.dto';
import { createAndLoginUser } from './helpers';
import { Tag } from '../src/tag/tag.entity';
import { TagService } from '../src/tag/tag.service';
import { CreateTagDto } from '../src/tag/dto/create-tag.dto';

describe('SocialController (e2e)', () => {
  const userRepoToken = getRepositoryToken(User);
  const tagRepoToken = getRepositoryToken(Tag);
  const tag: CreateTagDto = {
    title: 'TEST_TITLE',
  };
  let userService: UserService;
  let userRepo: Repository<User>;
  let tagRepo: Repository<Tag>;
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
        TagService,
        {
          provide: tagRepoToken,
          useClass: Repository,
        },
        {
          provide: userRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    tagRepo = moduleFixture.get(tagRepoToken);
    userRepo = moduleFixture.get(userRepoToken);
    userService = moduleFixture.get<UserService>(UserService);
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnectionManager().get('default');
    await defaultConnection.close();
  });

  it('/tag (GET)', async () => {
    const newTag = await tagRepo.save(tag);
    const { status, body } = await request(app.getHttpServer()).get('/tag');

    await tagRepo.delete(newTag.id);

    expect(status).toBe(HttpStatus.OK);
    expect(body).toEqual([newTag]);
  });

  it('/tag (POST)', async () => {
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
      .post('/tag')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(tag);

    const createdTag = await tagRepo.findOne();
    await tagRepo.delete(createdTag.id);
    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.CREATED);
    expect(!!createdTag).toBe(true);
  });

  it('/tag (DELETE)', async () => {
    const login = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';
    const token = await createAndLoginUser(
      login,
      password,
      userService,
      request,
      app,
    );
    const newTag = await tagRepo.save(tag);

    const { status } = await request(app.getHttpServer())
      .delete(`/tag/${newTag.id}`)
      .auth(token.access, { type: 'bearer' });

    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(await tagRepo.findOne(newTag.id)).toBe(undefined);

    await tagRepo.delete(newTag.id);
  });
});
