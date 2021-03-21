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

    const data = await controller.getAll(page, limit, 'DESC');

    expect(data).toEqual(response);
    expect(service.getAll).toHaveBeenCalled();
    expect(service.getAll).toBeCalledWith(page, limit, 'DESC');
  });

  it('should create file', async () => {
    const file: Express.Multer.File = {
      buffer: undefined,
      destination: '',
      encoding: '',
      fieldname: '',
      mimetype: '',
      originalname: '',
      path: '',
      size: 0,
      stream: undefined,
      filename: '',
    };
    const dirId = 1;
    const fileData: CreateFileDto = {
      directory: { id: dirId },
      name: file.filename,
    };
    const expectedValue = new File();

    jest.spyOn(service, 'create').mockResolvedValueOnce(expectedValue);

    const result = await controller.create(dirId, file);

    expect(result).toEqual(expectedValue);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toBeCalledWith(fileData);
  });

  it('should remove file', async () => {
    const id = 1;
    jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

    await controller.remove(id);

    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toBeCalledWith(id);
  });
});
