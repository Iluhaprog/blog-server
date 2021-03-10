import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../post.controller';
import { PostService } from '../post.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

describe('PostController', () => {
  const repoToken = getRepositoryToken(Post);
  let controller: PostController;
  let service: PostService;
  let repo: Repository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PostService,
        {
          provide: repoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
    repo = module.get(repoToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  it('should find all posts', async () => {
    const post = new Post();
    const responce = {
      data: [post],
      total: 1,
    };
    const page = 2;
    const limit = 1;
    jest.spyOn(service, 'findAll').mockResolvedValueOnce(responce);

    const data = await controller.findAll(page, limit);

    expect(data).toEqual(responce);
    expect(service.findAll).toHaveBeenCalled();
    expect(service.findAll).toBeCalledWith(page, limit);
  });

  it('should find post by id', async () => {
    const post = new Post();
    const id = 1;
    jest.spyOn(service, 'findById').mockResolvedValueOnce(post);

    const data = await controller.findById(id);

    expect(data).toEqual(post);
    expect(service.findById).toHaveBeenCalled();
    expect(service.findById).toBeCalledWith(id);
  });

  it('should find last posts', async () => {
    const post = new Post();
    jest.spyOn(service, 'findLast').mockResolvedValueOnce([post]);

    const data = await controller.findLast();

    expect(data).toEqual([post]);
    expect(service.findLast).toHaveBeenCalled();
  });

  it('should find posts by tags', async () => {
    const post = new Post();
    const tags = [1, 2, 3];
    jest.spyOn(service, 'findByTags').mockResolvedValueOnce([post]);

    const data = await controller.findByTags(tags);

    expect(data).toEqual([post]);
    expect(service.findByTags).toHaveBeenCalled();
    expect(service.findByTags).toBeCalledWith(tags);
  });

  it('should create post', async () => {
    const post: CreatePostDto = { preview: '', tags: [], text: '', title: '' };
    const req = { user: { id: 1 } };
    jest.spyOn(service, 'create').mockResolvedValueOnce(undefined);

    await controller.create(req, post);

    expect(service.create).toHaveBeenCalled();
    expect(service.create).toBeCalledWith(post, req.user.id);
  });

  it('should update post', async () => {
    const post: UpdatePostDto = {
      id: 1,
      preview: '',
      tags: [],
      text: '',
      title: '',
    };
    jest.spyOn(service, 'update').mockResolvedValueOnce(undefined);

    await controller.update(post);

    expect(service.update).toHaveBeenCalled();
    expect(service.update).toBeCalledWith(post);
  });

  it('should remove post', async () => {
    const id = 1;
    jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

    await controller.remove(id);

    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toBeCalledWith(id);
  });
});