import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from '../file.controller';
import { FileService } from '../file.service';
import { Repository } from 'typeorm';
import { File } from '../file.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateFileDto } from '../dto/create-file.dto';

describe('FileController', () => {
  const repoToken = getRepositoryToken(File);
  let controller: FileController;
  let service: FileService;
  let repo: Repository<File>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        FileService,
        {
          provide: repoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
    service = module.get<FileService>(FileService);
    repo = module.get(repoToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  it('should get all files', async () => {
    const file = new File();
    const response = {
      data: [file],
      total: 1,
    };
    const page = 2;
    const limit = 1;
    jest.spyOn(service, 'getAll').mockResolvedValueOnce(response);

    const data = await controller.getAll(page, limit);

    expect(data).toEqual(response);
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should create file', async () => {
    const file: CreateFileDto = { directory: { id: 0 }, name: '' };
    jest.spyOn(service, 'create').mockResolvedValueOnce(undefined);

    await controller.create(file);

    expect(service.create).toHaveBeenCalled();
    expect(service.create).toBeCalledWith(file);
  });

  it('should remove file', async () => {
    const id = 1;
    jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

    await controller.remove(id);

    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toBeCalledWith(id);
  });
});
