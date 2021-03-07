import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { RefreshToken } from '../refresh-token.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('RefreshToken entity', () => {
  const userToken = getRepositoryToken(User);
  const refreshToken = getRepositoryToken(RefreshToken);
  const user = {
    about: '',
    avatar: '',
    login: 'test',
    firstName: '',
    lastName: '',
    email: 'asdas@asda.aom',
    password: '12345678',
  };
  const refreshT = { token: 'test', expireIn: new Date() };
  let refreshTokenRepo: Repository<RefreshToken>;
  let userRepo: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    refreshTokenRepo = module.get(refreshToken);
    userRepo = module.get(userToken);
  });

  it('Should return undefined', async () => {
    expect(await refreshTokenRepo.findOne()).toBe(undefined);
  });

  it('Should create refresh token', async () => {
    const savedUser = await userRepo.save(await userRepo.create(user));
    const savedToken = await refreshTokenRepo.save(
      await refreshTokenRepo.create({
        ...refreshT,
        user: { id: savedUser.id },
      }),
    );
    await userRepo.delete(savedUser.id);
    expect(!!savedToken.id).toBe(true);
    expect(savedToken.user.id).toBe(savedUser.id);
  });

  it('Should delete refresh token', async () => {
    const savedToken = await refreshTokenRepo.save(
      await refreshTokenRepo.create(refreshT),
    );
    await refreshTokenRepo.delete(savedToken.id);
    expect(await refreshTokenRepo.findOne(savedToken.id)).toBe(undefined);
  });
});
