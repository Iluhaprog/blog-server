import { Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('Tag entity', () => {
  const tag = { title: 'test' };
  const token = getRepositoryToken(Tag);
  let repo: Repository<Tag>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    repo = module.get(token);
  });

  it('Should return undefined', async () => {
    expect(await repo.findOne()).toBe(undefined);
  });

  it('Should create tag', async () => {
    const savedTag = await repo.save(await repo.create(tag));
    await repo.delete(savedTag.id);
    expect(!!savedTag.id).toBe(true);
    expect(savedTag.title).toBe(tag.title);
  });

  it('Should delete tag', async () => {
    const savedTag = await repo.save(await repo.create(tag));
    await repo.delete(savedTag.id);
    expect(await repo.findOne(savedTag.id)).toBe(undefined);
  });
});
