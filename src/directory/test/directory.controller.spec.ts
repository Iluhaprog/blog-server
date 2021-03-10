import { Test, TestingModule } from '@nestjs/testing';
import { DirectoryController } from '../directory.controller';
import { DirectoryService } from '../directory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Directory } from '../directory.entity';
import { Repository } from 'typeorm';
import { CreateDirectoryDto } from '../dto/create-directory.dto';

describe('DirectoryController', () => {
  const repoToken = getRepositoryToken(Directory);
  let controller: DirectoryController;
  let service: DirectoryService;
  let repo: Repository<Directory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DirectoryController],
      providers: [
        DirectoryService,
        {
          provide: repoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<DirectoryController>(DirectoryController);
    service = module.get<DirectoryService>(DirectoryService);
    repo = module.get(repoToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  it('should get all directories', async () => {
    const dir = new Directory();
    const response = {
      data: [dir],
      total: 1,
    };
    const page = 2;
    const limit = 1;
    jest.spyOn(service, 'getAll').mockResolvedValueOnce(response);

    const data = await controller.getAll(page, limit);

    expect(data).toEqual(response);
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should create directory', async () => {
    const dir: CreateDirectoryDto = { name: '' };
    jest.spyOn(service, 'create').mockResolvedValueOnce(undefined);

    await controller.create(dir);

    expect(service.create).toHaveBeenCalled();
    expect(service.create).toBeCalledWith(dir);
  });

  it('should remove directory', async () => {
    const id = 1;
    jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

    await controller.remove(id);

    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toBeCalledWith(id);
  });
});
