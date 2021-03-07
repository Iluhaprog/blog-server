import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../app.module';

describe('User entity', () => {
  const token = getRepositoryToken(User);
  const user = {
    login: 'test',
    password: 'test1234',
    about: '',
    firstName: 'testFN',
    lastName: 'testLN',
    email: 'test@email.com',
    avatar: '',
  };
  let repo: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    repo = module.get(token);
  });

  it('Should return undefined', async () => {
    expect(await repo.findOne()).toBe(undefined);
  });

  it('Should create user', async () => {
    const savedUser = await repo.save(await repo.create(user));
    const passIsEqual = await bcrypt.compare(user.password, savedUser.password);
    await repo.delete(savedUser.id);

    expect(passIsEqual).toBe(true);
    expect(!!savedUser.id).toBe(true);
  });

  it('Should delete user', async () => {
    const savedUser = await repo.save(await repo.create(user));
    await repo.delete(savedUser.id);
    expect(await repo.findOne(savedUser.id)).toBe(undefined);
  });

  it('Should valid password', async () => {
    let error;
    try {
      await repo.save(await repo.create({ ...user, password: '1234' }));
    } catch (e) {
      error = e;
    }
    expect(error instanceof Error).toBe(true);
  });

  it('Should valid email', async () => {
    let error;
    try {
      await repo.save(await repo.create({ ...user, email: 'email.com' }));
    } catch (e) {
      error = e;
    }
    expect(error instanceof Error).toBe(true);
  });
});
