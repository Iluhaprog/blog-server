import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { User } from '../../user/user.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('Post entity', () => {
  const postToken = getRepositoryToken(Post);
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
    creationDate: new Date(),
  };
  let postRepo: Repository<Post>;
  let userRepo: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    postRepo = module.get(postToken);
    userRepo = module.get(userToken);
  });

  it('Should return undefined', async () => {
    expect(await postRepo.findOne()).toBe(undefined);
  });

  it('Should create post', async () => {
    const savedUser = await userRepo.save(await userRepo.create(user));
    const savedPost = await postRepo.save(
      await postRepo.create({
        ...post,
        user: { id: savedUser.id },
      }),
    );
    await userRepo.delete(savedUser.id);

    expect(!!savedPost).toBe(true);
    expect(savedPost.user.id).toBe(savedUser.id);
  });

  it('Should delete post', async () => {
    const savedPost = await postRepo.save(await postRepo.create(post));
    await postRepo.delete(savedPost.id);
    expect(await postRepo.findOne(savedPost.id)).toBe(undefined);
  });
});
