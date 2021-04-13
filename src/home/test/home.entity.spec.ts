import { getRepositoryToken } from '@nestjs/typeorm';
import { Home } from '../home.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('Home entity', () => {
  const homeToken = getRepositoryToken(Home);
  const home = {
    homeData: [
      {
        title: 'test',
        description: 'test',
      },
    ],
  };
  let homeRepo: Repository<Home>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    homeRepo = module.get(homeToken);
  });

  it('Should return undefined', async () => {
    expect(await homeRepo.findOne()).toBe(undefined);
  });

  it('Should create home', async () => {
    const savedHome = await homeRepo.save(await homeRepo.create(home));
    await homeRepo.delete(savedHome.id);

    expect(!!savedHome.id).toBe(true);
  });

  it('Should delete home', async () => {
    const savedHome = await homeRepo.save(await homeRepo.create(home));
    await homeRepo.delete(savedHome.id);

    expect(await homeRepo.findOne(savedHome.id)).toBe(undefined);
  });
});
