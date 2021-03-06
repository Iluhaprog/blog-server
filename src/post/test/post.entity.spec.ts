import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { User } from '../../user/user.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { Tag } from '../../tag/tag.entity';
import { PostData } from '../post.data.entity';
import { Locale } from '../../locale/locale.entity';

describe('Post entity', () => {
  const postToken = getRepositoryToken(Post);
  const tagToken = getRepositoryToken(Tag);
  const userToken = getRepositoryToken(User);
  const postDataToken = getRepositoryToken(PostData);
  const localeToken = getRepositoryToken(Locale);
  const user = {
    about: '',
    avatar: '',
    login: 'test',
    firstName: '',
    lastName: '',
    email: 'asdas@asda.aom',
    password: '12345678',
  };
  const postData = {
    title: '',
    description: '',
    text: '',
  };
  const locale = { name: 'test' };
  const post = {
    preview: '',
    isVisible: false,
    creationDate: new Date(),
  };
  let postRepo: Repository<Post>;
  let tagRepo: Repository<Tag>;
  let userRepo: Repository<User>;
  let localeRepo: Repository<Locale>;
  let postDataRepo: Repository<PostData>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    postRepo = module.get(postToken);
    tagRepo = module.get(tagToken);
    userRepo = module.get(userToken);
    postDataRepo = module.get(postDataToken);
    localeRepo = module.get(localeToken);
  });

  it('Should return undefined', async () => {
    expect(await postRepo.findOne()).toBe(undefined);
  });

  it('Should create post', async () => {
    const savedUser = await userRepo.save(await userRepo.create(user));
    const savedLocale = await localeRepo.save(await localeRepo.create(locale));
    const savedPostData = await postDataRepo.save(
      await postDataRepo.create({
        ...postData,
        locale: { id: savedLocale.id },
      }),
    );
    const savedPost = await postRepo.save(
      await postRepo.create({
        ...post,
        user: { id: savedUser.id },
        postData: [savedPostData],
      }),
    );
    await userRepo.delete(savedUser.id);
    await localeRepo.delete(savedLocale.id);

    expect(!!savedPost).toBe(true);
    expect(savedPost.postData.length).toBe(1);
    expect(savedPost.user.id).toBe(savedUser.id);
  });

  it('Should delete post', async () => {
    const savedPost = await postRepo.save(await postRepo.create(post));
    await postRepo.delete(savedPost.id);
    expect(await postRepo.findOne(savedPost.id)).toBe(undefined);
  });

  it('Should return post with tags', async () => {
    const tag1 = await tagRepo.save(await tagRepo.create({ title: 't1' }));
    const tag2 = await tagRepo.save(await tagRepo.create({ title: 't2' }));
    const savedPost = await postRepo.save(
      await postRepo.create({
        ...post,
        tags: [{ id: tag1.id }, { id: tag2.id }],
      }),
    );
    await tagRepo.delete(tag1.id);
    await tagRepo.delete(tag2.id);
    await postRepo.delete(savedPost.id);

    expect(savedPost.tags.length).toBe(2);
  });
});
