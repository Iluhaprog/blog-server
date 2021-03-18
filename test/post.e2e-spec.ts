import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { Post } from '../src/post/post.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { UserService } from '../src/user/user.service';
import { getConnectionManager, Repository } from 'typeorm';
import { PostService } from '../src/post/post.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { createAndLoginUser, createUser, sleep } from './helpers';
import { Tag } from '../src/tag/tag.entity';
import { CreatePostDto } from '../src/post/dto/create-post.dto';

describe('PostController (e2e)', () => {
  const userRepoToken = getRepositoryToken(User);
  const postRepoToken = getRepositoryToken(Post);
  const tagRepoToken = getRepositoryToken(Tag);
  let userService: UserService;
  let postService: PostService;
  let userRepo: Repository<User>;
  let postRepo: Repository<Post>;
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
        PostService,
        {
          provide: postRepoToken,
          useClass: Repository,
        },
        {
          provide: userRepoToken,
          useClass: Repository,
        },
        {
          provide: tagRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    postRepo = moduleFixture.get(postRepoToken);
    userRepo = moduleFixture.get(userRepoToken);
    tagRepo = moduleFixture.get(tagRepoToken);
    userService = moduleFixture.get<UserService>(UserService);
    postService = moduleFixture.get<PostService>(PostService);
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnectionManager().get('default');
    await defaultConnection.close();
  });

  it('/post/:page/:limit (GET)', async () => {
    const post = await postRepo.save({
      title: 'TEST_TILE',
      text: 'TEST_TEXT',
      preview: '',
      creationDate: new Date(),
      tags: [],
    });

    const { status, body } = await request(app.getHttpServer()).get(
      '/post/0/1',
    );

    await postRepo.delete(post.id);

    expect(status).toBe(HttpStatus.OK);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.total).toBe(1);
    expect(body.data[0].id).toEqual(post.id);
  });

  it('/post/:id (GET)', async () => {
    const post = await postRepo.save({
      title: 'TEST_TILE',
      text: 'TEST_TEXT',
      preview: '',
      creationDate: new Date(),
      tags: [],
    });

    const { status, body } = await request(app.getHttpServer()).get(
      `/post/${post.id}`,
    );

    await postRepo.delete(post.id);

    expect(status).toBe(HttpStatus.OK);
    expect(body.id).toBe(post.id);
  });

  it('/post (GET)', async () => {
    const post1 = await postRepo.save({
      title: 'TEST_TILE_1',
      text: 'TEST_TEXT_1',
      preview: '',
      creationDate: new Date(),
      tags: [],
    });

    const post2 = await sleep(
      async () =>
        await postRepo.save({
          title: 'TEST_TILE_2',
          text: 'TEST_TEXT_2',
          preview: '',
          creationDate: new Date(),
          tags: [],
        }),
      1000,
    );

    const { status, body } = await request(app.getHttpServer()).get('/post');

    await postRepo.delete(post1.id);
    await postRepo.delete(post2.id);

    expect(status).toBe(HttpStatus.OK);
    expect(Array.isArray(body)).toBe(true);
    expect(body[0].id).toBe(post2.id);
    expect(body[1].id).toBe(post1.id);
  });

  it('/post/by-tags (POST)', async () => {
    const login = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';
    const { userId } = await createAndLoginUser(
      login,
      password,
      userService,
      request,
      app,
    );
    const tag1 = await tagRepo.save({ title: 'test_tag_1' });
    const tag2 = await tagRepo.save({ title: 'test_tag_2' });
    const post1 = await postRepo.save({
      title: 'TEST_TILE_1',
      text: 'TEST_TEXT_1',
      preview: '',
      creationDate: new Date(),
      user: { id: userId },
      tags: [{ id: tag1.id }],
    });
    const post2 = await postRepo.save({
      title: 'TEST_TILE_2',
      text: 'TEST_TEXT_2',
      preview: '',
      creationDate: new Date(),
      user: { id: userId },
      tags: [{ id: tag2.id }],
    });

    const res1 = await request(app.getHttpServer())
      .post('/post/by-tags')
      .set('Content-Type', 'application/json')
      .send({
        tags: [tag1.id],
      });
    const res2 = await request(app.getHttpServer())
      .post('/post/by-tags')
      .set('Content-Type', 'application/json')
      .send({
        tags: [tag2.id],
      });

    await postRepo.delete(post1.id);
    await postRepo.delete(post2.id);
    await tagRepo.delete(tag1.id);
    await tagRepo.delete(tag2.id);
    await userRepo.delete(userId);

    expect(res1.status).toBe(HttpStatus.OK);
    expect(res2.status).toBe(HttpStatus.OK);

    expect(Array.isArray(res1.body)).toBe(true);
    expect(Array.isArray(res2.body)).toBe(true);

    expect(res1.body.length).toBe(1);
    expect(res2.body.length).toBe(1);

    expect(res1.body[0].id).toBe(post1.id);
    expect(res2.body[0].id).toBe(post2.id);
  });

  it('/post (POST)', async () => {
    const login = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';
    const token = await createAndLoginUser(
      login,
      password,
      userService,
      request,
      app,
    );
    const post: CreatePostDto = {
      preview: 'TEST.IMG',
      tags: [],
      text: 'TEST_TEXT',
      title: 'TEST_TITLE',
    };

    const { status } = await request(app.getHttpServer())
      .post('/post')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(post);

    const createdPost = await postRepo.findOne({
      where: { user: { id: token.userId } },
    });

    await userRepo.delete(token.userId);
    await postRepo.delete(createdPost.id);

    expect(status).toBe(HttpStatus.CREATED);
    expect(!!createdPost).toBe(true);
  });

  it('/post (PUT)', async () => {
    const login = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';
    const token = await createAndLoginUser(
      login,
      password,
      userService,
      request,
      app,
    );
    const newPost = await postRepo.save({
      preview: 'TEST.IMG',
      tags: [],
      text: 'TEST_TEXT',
      creationDate: new Date(),
      title: 'TEST_TITLE',
    });
    const newTitle = newPost.title + '_U';

    const { status } = await request(app.getHttpServer())
      .put('/post')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send({
        id: newPost.id,
        preview: newPost.preview,
        text: newPost.text,
        title: newTitle,
        tags: [],
      });

    const post = await postRepo.findOne(newPost.id);
    await userRepo.delete(token.userId);
    await postRepo.delete(post.id);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(post.title).toBe(newTitle);
  });

  it('/post (DELETE)', async () => {
    const login = 'TEST_LOGIN';
    const password = 'TEST_PASSWORD';
    const token = await createAndLoginUser(
      login,
      password,
      userService,
      request,
      app,
    );
    const newPost = await postRepo.save({
      preview: 'TEST.IMG',
      tags: [],
      text: 'TEST_TEXT',
      creationDate: new Date(),
      title: 'TEST_TITLE',
    });

    const { status } = await request(app.getHttpServer())
      .delete(`/post/${newPost.id}`)
      .auth(token.access, { type: 'bearer' });

    const post = await postRepo.findOne(newPost.id);

    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(post).toBe(undefined);
  });
});
