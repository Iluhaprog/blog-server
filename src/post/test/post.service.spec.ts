import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

describe('PostService', () => {
  const postRepoToken = getRepositoryToken(Post);
  let service: PostService;
  let postRepo: Repository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: postRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepo = module.get(postRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find post by id', async () => {
    const post = new Post();
    const id = 1;
    jest.spyOn(postRepo, 'findOne').mockResolvedValueOnce(post);

    const findedPost = await service.findById(id);

    expect(findedPost).toEqual(post);
    expect(postRepo.findOne).toHaveBeenCalled();
    expect(postRepo.findOne).toBeCalledWith(id);
  });

  it('should find posts by tags', async () => {
    const post = new Post();
    const tags = [1, 2];
    jest.spyOn(postRepo, 'find').mockResolvedValueOnce([post]);

    const posts = await service.findByTags(tags);
    expect(posts).toEqual([post]);
    expect(postRepo.find).toHaveBeenCalled();
    expect(postRepo.find).toBeCalledWith({
      where: {
        tags: [{ id: 1 }, { id: 2 }],
      },
    });
  });

  it('should find last post by date', async () => {
    const post = new Post();
    jest.spyOn(postRepo, 'find').mockResolvedValueOnce([post]);

    const posts = await service.findLast();
    expect(posts).toEqual([post]);
    expect(postRepo.find).toHaveBeenCalled();
    expect(postRepo.find).toBeCalledWith({
      order: {
        creationDate: 'DESC',
      },
      take: +process.env.LAST_POSTS_TAKE,
    });
  });

  it('should create post', async () => {
    const post = new Post();
    const newPost: CreatePostDto = {
      preview: 'new preview',
      tags: [1, 2, 3],
      text: 'TEST TEXT',
      title: 'TEST TITLE',
    };
    jest.spyOn(postRepo, 'create').mockReturnValue(post);
    jest
      .spyOn(postRepo, 'save')
      .mockResolvedValueOnce(Promise.resolve(undefined));

    await service.create(newPost);
    expect(postRepo.create).toHaveBeenCalled();
    expect(postRepo.create).toBeCalledWith({
      ...newPost,
      tags: [{ id: 1 }, { id: 2 }, { id: 3 }],
    });
    expect(postRepo.save).toHaveBeenCalled();
    expect(postRepo.save).toBeCalledWith(post);
  });

  it('should update post', async () => {
    const updatedPost: UpdatePostDto = {
      id: 1,
      preview: 'new preview',
      tags: [1, 2, 3],
      text: 'TEST TEXT',
      title: 'TEST TITLE',
    };
    jest
      .spyOn(postRepo, 'update')
      .mockResolvedValueOnce(Promise.resolve(undefined));

    await service.update(updatedPost);
    expect(postRepo.update).toHaveBeenCalled();
    expect(postRepo.update).toBeCalledWith(updatedPost.id, {
      ...updatedPost,
      tags: [{ id: 1 }, { id: 2 }, { id: 3 }],
    });
  });

  it('Should remove post', async () => {
    const id = 1;
    jest
      .spyOn(postRepo, 'delete')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    await service.remove(id);
    expect(postRepo.delete).toHaveBeenCalled();
    expect(postRepo.delete).toBeCalledWith(id);
  });
});
