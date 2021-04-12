import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { PostData } from '../post.data.entity';
import { Locale } from '../../locale/locale.entity';
import { User } from '../../user/user.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('PostData entity', () => {
  const postToken = getRepositoryToken(Post);
  const localeToken = getRepositoryToken(Locale);
  const postDataToken = getRepositoryToken(PostData);
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
  const post = {
    title: 'test',
    text: 'test text',
    preview: '',
    description: '',
    isVisible: false,
    creationDate: new Date(),
  };
  const locale = { name: 'TEST_LOCALE' };
  const postData = {
    title: '',
    description: '',
    test: '',
  };
  let postRepo: Repository<Post>;
  let localeRepo: Repository<Locale>;
  let userRepo: Repository<User>;
  let postDataRepo: Repository<PostData>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    postRepo = module.get(postToken);
    localeRepo = module.get(localeToken);
    userRepo = module.get(userToken);
    postDataRepo = module.get(postDataToken);
  });

  it('Should return undefined', async () => {
    expect(await postDataRepo.findOne()).toBe(undefined);
  });

  it('Should create post data', async () => {
    const savedUser = await userRepo.save(await userRepo.create(user));
    const savedPost = await postRepo.save(
      await postRepo.create({
        ...post,
        user: { id: savedUser.id },
      }),
    );
    const savedLocale = await localeRepo.save(localeRepo.create(locale));
    const savedPostData = await postDataRepo.save(
      postDataRepo.create({
        ...postData,
        locale: { id: savedLocale.id },
        post: { id: savedPost.id },
      }),
    );
    await userRepo.delete(savedUser.id);
    await localeRepo.delete(savedLocale.id);

    expect(!!savedPostData).toBe(true);
    expect(savedPostData.locale.id).toBe(savedLocale.id);
    expect(savedPostData.post.id).toBe(savedPost.id);
  });

  it('should delete post data by id', async () => {
    const savedPostData = await postDataRepo.save(
      postDataRepo.create(postData),
    );
    await postDataRepo.delete(savedPostData.id);
    expect(await postDataRepo.findOne(savedPostData.id)).toBe(undefined);
  });
});
