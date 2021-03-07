import { Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { Post } from '../../post/post.entity';

describe('Tag entity', () => {
  const tag = { title: 'test' };
  const post = {
    title: 'test',
    text: 'test text',
    preview: '',
    creationDate: new Date(),
  };
  const token = getRepositoryToken(Tag);
  const postToken = getRepositoryToken(Post);
  let tagRepo: Repository<Tag>;
  let postRepo: Repository<Post>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    tagRepo = module.get(token);
    postRepo = module.get(postToken);
  });

  it('Should return undefined', async () => {
    expect(await tagRepo.findOne()).toBe(undefined);
  });

  it('Should create tag', async () => {
    const savedTag = await tagRepo.save(await tagRepo.create(tag));
    await tagRepo.delete(savedTag.id);
    expect(!!savedTag.id).toBe(true);
    expect(savedTag.title).toBe(tag.title);
  });

  it('Should delete tag', async () => {
    const savedTag = await tagRepo.save(await tagRepo.create(tag));
    await tagRepo.delete(savedTag.id);
    expect(await tagRepo.findOne(savedTag.id)).toBe(undefined);
  });

  it('Should return tag with posts', async () => {
    const savedPost1 = await postRepo.save(await postRepo.create(post));
    const savedPost2 = await postRepo.save(
      await postRepo.create({ ...post, title: 't2' }),
    );
    const savedTag = await tagRepo.save(
      await tagRepo.create({
        ...tag,
        posts: [{ id: savedPost1.id }, { id: savedPost2.id }],
      }),
    );
    await postRepo.delete(savedPost1.id);
    await postRepo.delete(savedPost2.id);
    await tagRepo.delete(savedTag.id);

    expect(savedTag.posts.length).toBe(2);
  });
});
