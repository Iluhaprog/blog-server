import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from '../tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from '../dto/create-tag.dto';

describe('TagService', () => {
  const tagRepoToken = getRepositoryToken(Tag);
  let service: TagService;
  let tagRepo: Repository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: tagRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
    tagRepo = module.get(tagRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all tags', async () => {
    const tag = new Tag();
    jest.spyOn(tagRepo, 'find').mockResolvedValueOnce([tag]);
    const tags = await service.getAll();
    expect(tags).toEqual([tag]);
    expect(tagRepo.find).toHaveBeenCalled();
  });

  it('should create tag', async () => {
    const tag = new Tag();
    const newTag: CreateTagDto = {
      title: '',
    };
    jest.spyOn(tagRepo, 'create').mockReturnValue(tag);
    jest
      .spyOn(tagRepo, 'save')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    await service.create(newTag);
    expect(tagRepo.create).toHaveBeenCalled();
    expect(tagRepo.create).toBeCalledWith(newTag);
    expect(tagRepo.save).toHaveBeenCalled();
    expect(tagRepo.save).toBeCalledWith(tag);
  });

  it('should remove tag', async () => {
    const id = 1;
    jest
      .spyOn(tagRepo, 'delete')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    await service.remove(id);
    expect(tagRepo.delete).toHaveBeenCalled();
    expect(tagRepo.delete).toBeCalledWith(id);
  });
});
