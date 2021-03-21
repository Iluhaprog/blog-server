import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { getConnectionManager, Repository } from 'typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import * as request from 'supertest';
import { createAndLoginUser } from './helpers';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';
import { UpdateUserPasswordDto } from '../src/user/dto/update-user-password.dto';

describe('UserController (e2e)', () => {
  const userRepoToken = getRepositoryToken(User);
  const user: CreateUserDto = {
    about: 'TEST_ABOUT',
    avatar: 'TEST_AVATAR',
    email: 'TEST_EMAIL@TEST.TEST',
    firstName: 'TEST_FIRST_NAME',
    lastName: 'TEST_LAST_NAME',
    login: 'TEST_LOGIN',
    password: 'TEST_PASSWORD',
  };
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
          provide: userRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepo = moduleFixture.get(userRepoToken);
    userService = moduleFixture.get<UserService>(UserService);
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnectionManager().get('default');
    await defaultConnection.close();
  });

  it('/user/:id (GET)', async () => {
    const newUser = await userRepo.save(user);
    const { status, body } = await request(app.getHttpServer()).get(
      `/user/${newUser.id}`,
    );

    await userRepo.delete(newUser.id);

    expect(status).toBe(HttpStatus.OK);
    expect(body).toEqual(newUser);
  });

  it('/user (POST)', async () => {
    const token = await createAndLoginUser(
      user.login,
      user.password,
      userService,
      request,
      app,
    );

    const { status } = await request(app.getHttpServer())
      .post('/user')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(user);

    const createdUser = await userRepo.findOne();

    await userRepo.delete(createdUser.id);
    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.CREATED);
    expect(!!createdUser).toBe(true);
  });

  it('/user (PUT)', async () => {
    const token = await createAndLoginUser(
      user.login,
      user.password,
      userService,
      request,
      app,
    );

    const newLN = user.lastName + '_U';

    const updatedUser: UpdateUserDto = {
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      firstName: user.firstName,
      id: token.userId,
      lastName: newLN,
      login: user.login,
    };

    const { status } = await request(app.getHttpServer())
      .put('/user')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(updatedUser);

    const updated = await userRepo.findOne(updatedUser.id);

    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(updated.lastName).toBe(newLN);
  });

  it('/user/password (PUT)', async () => {
    const token = await createAndLoginUser(
      user.login,
      user.password,
      userService,
      request,
      app,
    );

    const newPassword = '12345678';

    const updatedUser: UpdateUserPasswordDto = {
      id: token.userId,
      newPassword: newPassword,
      newPasswordRepeat: newPassword,
      oldPassword: user.password,
    };

    const { status } = await request(app.getHttpServer())
      .put('/user/password')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(updatedUser);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .auth(user.login, newPassword);

    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(response.status).toBe(HttpStatus.OK);
  });

  it('/user/password (PUT) mismatch new password', async () => {
    const token = await createAndLoginUser(
      user.login,
      user.password,
      userService,
      request,
      app,
    );

    const newPassword = '12345678';

    const updatedUser: UpdateUserPasswordDto = {
      id: token.userId,
      newPassword: newPassword,
      newPasswordRepeat: newPassword + 'MISMATCH',
      oldPassword: user.password,
    };

    const { status } = await request(app.getHttpServer())
      .put('/user/password')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(updatedUser);

    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('/user/password (PUT) match wrong an old password', async () => {
    const token = await createAndLoginUser(
      user.login,
      user.password,
      userService,
      request,
      app,
    );

    const updatedUser: UpdateUserPasswordDto = {
      id: token.userId,
      newPassword: user.password + 'WRONG',
      newPasswordRepeat: user.password,
      oldPassword: user.password,
    };

    const { status } = await request(app.getHttpServer())
      .put('/user/password')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(updatedUser);

    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('/user/:id (DELETE)', async () => {
    const token = await createAndLoginUser(
      user.login,
      user.password,
      userService,
      request,
      app,
    );

    const { status } = await request(app.getHttpServer())
      .delete(`/user/${token.userId}`)
      .auth(token.access, { type: 'bearer' });

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(await userRepo.findOne(token.userId)).toBe(undefined);
  });
});
