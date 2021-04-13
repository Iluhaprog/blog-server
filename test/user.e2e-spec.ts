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
import { UserData } from '../src/user/user.data.entity';
import { Locale } from '../dist/locale/locale.entity';

describe('UserController (e2e)', () => {
  const userRepoToken = getRepositoryToken(User);
  const localeToken = getRepositoryToken(Locale);
  const userDataRepoToken = getRepositoryToken(UserData);
  const user = {
    avatar: 'TEST_AVATAR',
    email: 'TEST_EMAIL@TEST.TEST',
    login: 'TEST_LOGIN',
    password: 'TEST_PASSWORD',
  };
  const userData = {
    about: 'TEST_ABOUT',
    firstName: 'TEST_FIRST_NAME',
    lastName: 'TEST_LAST_NAME',
  };
  const locale = { name: 'TEST_LOCALE' };
  let userRepo: Repository<User>;
  let userDataRepo: Repository<UserData>;
  let localeRepo: Repository<Locale>;
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
        {
          provide: userDataRepoToken,
          useClass: Repository,
        },
        {
          provide: localeToken,
          useClass: Repository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepo = moduleFixture.get(userRepoToken);
    userDataRepo = moduleFixture.get(userDataRepoToken);
    localeRepo = moduleFixture.get(localeToken);
    userService = moduleFixture.get<UserService>(UserService);
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnectionManager().get('default');
    await defaultConnection.close();
  });

  it('/user (GET)', async () => {
    const newLocale = await localeRepo.save(locale);
    const newUserData = await userDataRepo.save({
      ...userData,
      locale: newLocale,
    });
    const newUser = await userRepo.save({
      ...user,
      userData: [newUserData],
    });
    const { status, body } = await request(app.getHttpServer()).get('/user');
    await userRepo.delete(newUser.id);
    await localeRepo.delete(newLocale.id);

    expect(status).toBe(HttpStatus.OK);
    expect(body).toEqual([newUser]);
  });

  it('/user/:id (GET)', async () => {
    const newLocale = await localeRepo.save(locale);
    const newUserData = await userDataRepo.save({
      ...userData,
      locale: newLocale,
    });
    const newUser = await userRepo.save({
      ...user,
      userData: [newUserData],
    });
    const { status, body } = await request(app.getHttpServer()).get(
      `/user/${newUser.id}`,
    );

    await userRepo.delete(newUser.id);
    await localeRepo.delete(newLocale.id);

    expect(status).toBe(HttpStatus.OK);
    expect(body).toEqual(newUser);
  });

  it('/user/current (GET)', async () => {
    const token = await createAndLoginUser(
      user.login,
      user.password,
      userService,
      request,
      app,
    );
    const { status, body } = await request(app.getHttpServer())
      .get(`/user/current`)
      .auth(token.access, { type: 'bearer' });

    await userRepo.delete(token.userId);

    expect(status).toBe(HttpStatus.OK);
    expect(body.id).toEqual(token.userId);
  });

  it('/user (POST)', async () => {
    const token = await createAndLoginUser(
      user.login + 'U',
      user.password,
      userService,
      request,
      app,
    );

    const { status, body } = await request(app.getHttpServer())
      .post('/user')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send({
        ...user,
        password: '123456789',
        userData: [],
      });

    const createdUser = await userRepo.findOne(body.id, {
      relations: ['userData'],
    });

    await userRepo.delete(createdUser.id);
    await userRepo.delete(token.userId);

    expect(body).toEqual(createdUser);
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

    const newFN = 'FN';
    const newLocale = await localeRepo.save(locale);
    const newUserData = await userDataRepo.save({
      ...userData,
      locale: newLocale,
    });
    const newUser = await userRepo.save({
      ...user,
      userData: [
        {
          ...newUserData,
        },
      ],
    });

    const updatedUser: UpdateUserDto = {
      avatar: user.avatar,
      email: user.email,
      id: token.userId,
      login: user.login,
      userData: [
        {
          ...newUserData,
          firstName: newFN,
        },
      ],
    };

    const { status } = await request(app.getHttpServer())
      .put('/user')
      .auth(token.access, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(updatedUser);

    const updated = await userRepo.findOne(updatedUser.id, {
      relations: ['userData'],
    });

    await userRepo.delete(token.userId);
    await userRepo.delete(newUser.id);
    await localeRepo.delete(newLocale.id);

    expect(status).toBe(HttpStatus.NO_CONTENT);
    expect(updated.userData[0].firstName).toBe(newFN);
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
