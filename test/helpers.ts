import { UserService } from '../src/user/user.service';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { INestApplication } from '@nestjs/common';

type Token = {
  userId: number;
  refresh: string;
  access: string;
};

export async function createUser(
  login,
  password,
  service: UserService,
): Promise<void> {
  const user: CreateUserDto = {
    about: '',
    avatar: '',
    email: 'TEST_EMAIL@TEST.TEST',
    firstName: '',
    lastName: '',
    login,
    password,
  };
  await service.create(user);
}

export async function createAndLoginUser(
  username: string,
  password: string,
  service: UserService,
  request,
  app: INestApplication,
): Promise<Token> {
  await createUser(username, password, service);
  const user = await service.findByLogin(username);
  const { body } = await request(app.getHttpServer())
    .post('/auth/login')
    .query({ username })
    .query({ password });
  return {
    userId: user.id,
    refresh: body.refreshToken,
    access: body.accessToken,
  };
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sleep(fn, ms, ...args) {
  await timeout(ms);
  return fn(...args);
}
