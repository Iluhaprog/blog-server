import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from '../file.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { File } from '../file.entity';
import { Repository } from 'typeorm';
import { CreateFileDto } from '../dto/create-file.dto';

describe('FileService', () => {
  const fileRepoToken = getRepositoryToken(File);
  let service: FileService;
  let fileRepo: Repository<File>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: fileRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
    fileRepo = module.get(fileRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all files', async () => {
    const file = new File();
    jest.spyOn(fileRepo, 'findAndCount').mockResolvedValueOnce([[file], 1]);
    const { data, total } = await service.getAll(2, 1, 'DESC');
    expect(data).toEqual([file]);
    expect(total).toBe(1);
    expect(fileRepo.findAndCount).toHaveBeenCalled();
    expect(fileRepo.findAndCount).toBeCalledWith({
      order: { id: 'DESC' },
      take: 1,
      skip: 2,
    });
  });

  it('should get files by dir id', async () => {
    const file = new File();
    const dirId = 1;
    jest.spyOn(fileRepo, 'find').mockResolvedValueOnce([file]);
    const data = await service.getByDirId(dirId, 'DESC');
    expect(data).toEqual([file]);
    expect(fileRepo.find).toHaveBeenCalled();
    expect(fileRepo.find).toBeCalledWith({
      order: { id: 'DESC' },
      where: {
        directory: { id: dirId },
      },
    });
  });

  it('should create file', async () => {
    const newFile: CreateFileDto = {
      name: '',
      directory: { id: 1 },
    };
    const file = new File();
    jest.spyOn(fileRepo, 'create').mockReturnValue(file);
    jest.spyOn(fileRepo, 'save').mockResolvedValueOnce(Promise.resolve(file));
    const result = await service.create(newFile);

    expect(result).toEqual(file);
    expect(fileRepo.create).toHaveBeenCalled();
    expect(fileRepo.create).toBeCalledWith(newFile);
    expect(fileRepo.save).toHaveBeenCalled();
    expect(fileRepo.save).toBeCalledWith(file);
  });

  it('should remove file', async () => {
    const id = 1;
    jest
      .spyOn(fileRepo, 'delete')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    await service.remove(id);
    expect(fileRepo.delete).toHaveBeenCalled();
    expect(fileRepo.delete).toBeCalledWith(id);
  });
});
