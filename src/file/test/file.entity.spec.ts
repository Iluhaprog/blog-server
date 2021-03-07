import { getRepositoryToken } from '@nestjs/typeorm';
import { File } from '../file.entity';
import { Directory } from '../../directory/directory.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('File entity', () => {
  const fileToken = getRepositoryToken(File);
  const dirToken = getRepositoryToken(Directory);
  const file = { name: 'test' };
  const dir = { name: 'test' };
  let fileRepo: Repository<File>;
  let dirRepo: Repository<Directory>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    fileRepo = module.get(fileToken);
    dirRepo = module.get(dirToken);
  });

  it('Should return undefined', async () => {
    expect(await fileRepo.findOne()).toBe(undefined);
  });

  it('Should create file', async () => {
    const savedDir = await dirRepo.save(await dirRepo.create(dir));
    const savedFile = await fileRepo.save(
      await fileRepo.create({
        ...file,
        directory: { id: savedDir.id },
      }),
    );
    await dirRepo.delete(savedDir.id);

    expect(!!savedFile.id).toBe(true);
    expect(savedFile.directory.id).toBe(savedDir.id);
  });

  it('Should delete file', async () => {
    const savedFile = await fileRepo.save(await fileRepo.create(file));
    await fileRepo.delete(savedFile.id);

    expect(await fileRepo.findOne(savedFile.id)).toBe(undefined);
  });

  it('Should be unique file', async () => {
    let error;
    let f1;
    try {
      f1 = await fileRepo.save(await fileRepo.create(file));
      await fileRepo.save(await fileRepo.create(file));
    } catch (e) {
      error = e;
    }
    await fileRepo.delete(f1.id);
    expect(error instanceof Error).toBe(true);
  });
});
