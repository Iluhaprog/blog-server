import { getRepositoryToken } from '@nestjs/typeorm';
import { Directory } from '../directory.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('Directory entity', () => {
  const dirToken = getRepositoryToken(Directory);
  const dir = { name: 'dir' };
  let dirRepo: Repository<Directory>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    dirRepo = module.get(dirToken);
  });

  it('Should return undefined', async () => {
    expect(await dirRepo.findOne()).toBe(undefined);
  });

  it('Should create directory', async () => {
    const savedDir = await dirRepo.save(await dirRepo.create(dir));
    await dirRepo.delete(savedDir.id);

    expect(!!savedDir.id).toBe(true);
  });

  it('Should delete dir', async () => {
    const savedDir = await dirRepo.save(await dirRepo.create(dir));
    await dirRepo.delete(savedDir.id);

    expect(await dirRepo.findOne(savedDir.id)).toBe(undefined);
  });

  it('Should be unique directory', async () => {
    let error;
    let d1;
    try {
      d1 = await dirRepo.save(await dirRepo.create(dir));
      await dirRepo.save(await dirRepo.create(dir));
    } catch (e) {
      error = e;
    }
    await dirRepo.delete(d1.id);

    expect(error instanceof Error).toBe(true);
  });
});
