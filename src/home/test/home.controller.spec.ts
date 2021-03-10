import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from '../home.controller';
import { HomeService } from '../home.service';
import { Repository } from 'typeorm';
import { Home } from '../home.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateHomeDto } from '../dto/create-home.dto';
import { UpdateHomeDto } from '../dto/update-home.dto';

describe('HomeController', () => {
  const repoToken = getRepositoryToken(Home);
  let controller: HomeController;
  let service: HomeService;
  let repo: Repository<Home>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        HomeService,
        {
          provide: repoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    service = module.get<HomeService>(HomeService);
    repo = module.get(repoToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  it('should get all homes', async () => {
    const home = new Home();
    jest.spyOn(service, 'getAll').mockResolvedValueOnce([home]);

    const homes = await controller.getAll();

    expect(homes).toEqual([home]);
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should get home', async () => {
    const home = new Home();
    jest.spyOn(service, 'get').mockResolvedValueOnce(home);

    const returnedHome = await controller.get();

    expect(returnedHome).toEqual(home);
    expect(service.get).toHaveBeenCalled();
  });

  it('should create home', async () => {
    const home: CreateHomeDto = { description: '', title: '' };
    jest.spyOn(service, 'create').mockResolvedValueOnce(undefined);

    await controller.create(home);

    expect(service.create).toHaveBeenCalled();
    expect(service.create).toBeCalledWith(home);
  });

  it('should update home', async () => {
    const home: UpdateHomeDto = { id: 1, description: '', title: '' };
    jest.spyOn(service, 'update').mockResolvedValueOnce(undefined);

    await controller.update(home);

    expect(service.update).toHaveBeenCalled();
    expect(service.update).toBeCalledWith(home);
  });

  it('should remove home', async () => {
    const id = 1;
    jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

    await controller.remove(id);

    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toBeCalledWith(id);
  });
});
