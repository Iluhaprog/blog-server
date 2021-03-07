import { Repository } from 'typeorm';
import { Social } from '../social.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { User } from '../../user/user.entity';

describe('Social entity', () => {
  const socialToken = getRepositoryToken(Social);
  const userToken = getRepositoryToken(User);
  const user = {
    about: '',
    avatar: '',
    login: 'test',
    firstName: '',
    lastName: '',
    email: 'asdas@asda.aom',
    password: '12345678',
  };
  const social = { title: 'test', link: 'link', preview: 'test' };
  let socialRepo: Repository<Social>;
  let userRepo: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    socialRepo = module.get(socialToken);
    userRepo = module.get(userToken);
  });

  it('Should return undefined', async () => {
    expect(await socialRepo.findOne()).toBe(undefined);
  });

  it('Should create social', async () => {
    const savedUser = await userRepo.save(await userRepo.create(user));
    const savedSocial = await socialRepo.save(
      await socialRepo.create({
        ...social,
        user: { id: savedUser.id },
      }),
    );
    await userRepo.delete(savedUser.id);
    expect(!!savedSocial.id).toBe(true);
    expect(savedSocial.user.id).toBe(savedUser.id);
  });

  it('Should delete social', async () => {
    const savedSocial = await socialRepo.save(await socialRepo.create(social));
    await socialRepo.delete(savedSocial.id);
    expect(await socialRepo.findOne(savedSocial.id)).toBe(undefined);
  });

  it('Should be unique', async () => {
    let error;
    let savedSocial;
    try {
      savedSocial = await socialRepo.save(await socialRepo.create(social));
      await socialRepo.save(await socialRepo.create(social));
    } catch (e) {
      error = e;
    }
    await socialRepo.delete(savedSocial.id);
    expect(error instanceof Error).toBe(true);
  });
});
