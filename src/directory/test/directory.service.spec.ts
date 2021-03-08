import { Test, TestingModule } from '@nestjs/testing';
import { DirectoryService } from '../directory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Directory } from '../directory.entity';
import { Repository } from 'typeorm';
import { CreateDirectoryDto } from '../dto/create-directory.dto';

describe('DirectoryService', () => {
  const dirRepoToken = getRepositoryToken(Directory);
  let service: DirectoryService;
  let dirRepo: Repository<Directory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DirectoryService,
        {
          provide: dirRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DirectoryService>(DirectoryService);
    dirRepo = module.get(dirRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all dirs', async () => {
    const dir = new Directory();
    jest.spyOn(dirRepo, 'findAndCount').mockResolvedValueOnce([[dir], 1]);
    const { data, total } = await service.getAll(2, 1);
    expect(data).toEqual([dir]);
    expect(total).toBe(1);
    expect(dirRepo.findAndCount).toHaveBeenCalled();
    expect(dirRepo.findAndCount).toBeCalledWith({
      take: 1,
      skip: 2,
    });
  });

  it('should create dir', async () => {
    const newFile: CreateDirectoryDto = { name: '' };
    const dir = new Directory();
    jest.spyOn(dirRepo, 'create').mockReturnValue(dir);
    jest
      .spyOn(dirRepo, 'save')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    await service.create(newFile);
    expect(dirRepo.create).toHaveBeenCalled();
    expect(dirRepo.create).toBeCalledWith(newFile);
    expect(dirRepo.save).toHaveBeenCalled();
    expect(dirRepo.save).toBeCalledWith(dir);
  });

  it('should remove dir', async () => {
    const id = 1;
    jest
      .spyOn(dirRepo, 'delete')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    await service.remove(id);
    expect(dirRepo.delete).toHaveBeenCalled();
    expect(dirRepo.delete).toBeCalledWith(id);
  });
});
