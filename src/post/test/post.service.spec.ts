import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Tag } from '../../tag/tag.entity';
import { PostData } from '../post.data.entity';

describe('PostService', () => {
  const postRepoToken = getRepositoryToken(Post);
  const postDataRepoToken = getRepositoryToken(PostData);
  let service: PostService;
  let postRepo: Repository<Post>;
  let postDataRepo: Repository<PostData>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: postRepoToken,
          useClass: Repository,
        },
        {
          provide: postDataRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepo = module.get(postRepoToken);
    postDataRepo = module.get(postDataRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create post data', async () => {
    const post = new Post();
    const postData = new PostData();
    const localeId = 1;
    const postId = 1;
    jest.spyOn(postRepo, 'findOne').mockResolvedValueOnce(post);
    jest.spyOn(postRepo, 'save').mockResolvedValueOnce(post);
    jest.spyOn(postDataRepo, 'save').mockResolvedValueOnce(postData);

    const result = await service.addData(localeId, postId);

    expect(result).toEqual(postData);
    expect(postRepo.findOne).toHaveBeenCalled();
    expect(postRepo.findOne).toBeCalledWith(postId);
    expect(postRepo.save).toHaveBeenCalled();
    expect(postRepo.save).toBeCalledWith({
      ...post,
      postData: [postData],
    });
    expect(postDataRepo.save).toHaveBeenCalled();
    expect(postDataRepo.save).toBeCalledWith({
      title: '',
      text: '',
      description: '',
      locale: { id: localeId },
    });
  });

  it('should find visible posts', async () => {
    const post = new Post();
    jest.spyOn(postRepo, 'findAndCount').mockResolvedValueOnce([[post], 1]);
    const { data, total } = await service.findVisible(2, 1, 'DESC');
    expect(data).toEqual([post]);
    expect(total).toBe(1);
    expect(postRepo.findAndCount).toHaveBeenCalled();
    expect(postRepo.findAndCount).toBeCalledWith({
      order: { id: 'DESC' },
      relations: ['tags', 'postData', 'postData.locale'],
      take: 1,
      skip: 2,
      where: {
        isVisible: true,
      },
    });
  });

  it('should find all', async () => {
    const post = new Post();
    jest.spyOn(postRepo, 'findAndCount').mockResolvedValueOnce([[post], 1]);
    const { data, total } = await service.findAll(2, 1, 'DESC');
    expect(data).toEqual([post]);
    expect(total).toBe(1);
    expect(postRepo.findAndCount).toHaveBeenCalled();
    expect(postRepo.findAndCount).toBeCalledWith({
      order: { id: 'DESC' },
      relations: ['tags', 'postData', 'postData.locale'],
      take: 1,
      skip: 2,
    });
  });

  it('should find post by id', async () => {
    const post = new Post();
    const id = 1;
    jest.spyOn(postRepo, 'findOne').mockResolvedValueOnce(post);

    const findedPost = await service.findById(id);

    expect(findedPost).toEqual(post);
    expect(postRepo.findOne).toHaveBeenCalled();
    expect(postRepo.findOne).toBeCalledWith(id, {
      relations: ['tags', 'postData', 'postData.locale'],
    });
  });

  it('should find last post by date', async () => {
    const post = new Post();
    jest.spyOn(postRepo, 'find').mockResolvedValueOnce([post]);

    const posts = await service.findLast();
    expect(posts).toEqual([post]);
    expect(postRepo.find).toHaveBeenCalled();
    expect(postRepo.find).toBeCalledWith({
      relations: ['postData', 'postData.locale'],
      order: {
        creationDate: 'DESC',
      },
      take: +process.env.LAST_POSTS_TAKE,
    });
  });

  it('should create post', async () => {
    const post = new Post();
    const userId = 1;
    const newPost: CreatePostDto = {
      preview: 'new preview',
      tags: [1, 2, 3],
      isVisible: false,
      postData: [],
    };
    const expectedValue = new Post();
    jest.spyOn(postRepo, 'create').mockReturnValue(post);
    jest
      .spyOn(postRepo, 'save')
      .mockResolvedValueOnce(Promise.resolve(expectedValue));
    jest.spyOn(postRepo, 'findOne').mockResolvedValueOnce(expectedValue);


    const result = await service.create(newPost, userId);
    expect(result).toEqual(expectedValue);
    expect(postRepo.create).toHaveBeenCalled();
    expect(postRepo.save).toHaveBeenCalled();
    expect(postRepo.save).toBeCalledWith(post);
  });

  it('should update post', async () => {
    const post = new Post();
    const updatedPost: UpdatePostDto = {
      id: 1,
      preview: 'new preview',
      tags: [new Tag(), new Tag(), new Tag()],
      postData: [new PostData()],
      isVisible: false,
    };
    jest
      .spyOn(postRepo, 'save')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    jest.spyOn(postRepo, 'create').mockReturnValue(post);

    jest
      .spyOn(postDataRepo, 'save')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    jest.spyOn(postDataRepo, 'create').mockReturnValue(updatedPost.postData[0]);

    await service.update(updatedPost);
    expect(postRepo.save).toHaveBeenCalled();
    expect(postRepo.create).toHaveBeenCalled();
    expect(postRepo.save).toBeCalledWith(post);
    expect(postRepo.create).toBeCalledWith(updatedPost);
    expect(postDataRepo.save).toHaveBeenCalled();
    expect(postDataRepo.create).toHaveBeenCalled();
    expect(postDataRepo.save).toBeCalledWith(updatedPost.postData[0]);
    expect(postDataRepo.create).toBeCalledWith(updatedPost.postData[0]);
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
