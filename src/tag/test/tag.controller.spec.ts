import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from '../tag.controller';
import { TagService } from '../tag.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { CreateTagDto } from '../dto/create-tag.dto';

describe('TagController', () => {
  const repoToken = getRepositoryToken(Tag);
  let controller: TagController;
  let service: TagService;
  let repo: Repository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        TagService,
        {
          provide: repoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
    service = module.get<TagService>(TagService);
    repo = module.get(repoToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  it('should get all tags', async () => {
    const tag = new Tag();
    jest.spyOn(service, 'getAll').mockResolvedValueOnce([tag]);

    const tags = await controller.getAll('DESC');

    expect(tags).toEqual([tag]);
    expect(service.getAll).toHaveBeenCalled();
    expect(service.getAll).toBeCalledWith('DESC');
  });

  it('should create tag', async () => {
    const tag: CreateTagDto = {
      title: '',
    };
    const expectedValue = new Tag();

    jest.spyOn(service, 'create').mockResolvedValueOnce(expectedValue);

    const result = await controller.create(tag);

    expect(result).toEqual(expectedValue);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toBeCalledWith(tag);
  });

  it('should remove tag', async () => {
    const id = 1;
    jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

    await controller.remove(id);

    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toBeCalledWith(id);
  });
});
