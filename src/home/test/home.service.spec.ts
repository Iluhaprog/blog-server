import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from '../home.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Home } from '../home.entity';
import { Repository } from 'typeorm';
import { CreateHomeDto } from '../dto/create-home.dto';
import { UpdateHomeDto } from '../dto/update-home.dto';

describe('HomeService', () => {
  const homeRepoToken = getRepositoryToken(Home);
  let service: HomeService;
  let homeRepo: Repository<Home>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: homeRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    homeRepo = module.get(homeRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get home', async () => {
    const home = new Home();
    jest.spyOn(homeRepo, 'findOne').mockResolvedValueOnce(home);
    const findedHome = await service.get();

    expect(findedHome).toEqual(home);
    expect(homeRepo.findOne).toHaveBeenCalled();
    expect(homeRepo.findOne).toBeCalledWith({
      where: {
        selected: true,
      },
    });
  });

  it('should get all homes', async () => {
    const home = new Home();
    jest.spyOn(homeRepo, 'find').mockResolvedValueOnce([home]);
    const findedHomes = await service.getAll();

    expect(findedHomes).toEqual([home]);
    expect(homeRepo.find).toHaveBeenCalled();
  });

  it('should create home', async () => {
    const newHome: CreateHomeDto = {
      description: '',
      title: '',
    };
    const home = new Home();
    jest.spyOn(homeRepo, 'create').mockReturnValue(home);
    jest.spyOn(homeRepo, 'save').mockResolvedValueOnce(Promise.resolve(home));

    const result = await service.create(newHome);

    expect(result).toEqual(home);
    expect(homeRepo.create).toHaveBeenCalled();
    expect(homeRepo.create).toBeCalledWith(newHome);
    expect(homeRepo.save).toHaveBeenCalled();
    expect(homeRepo.save).toBeCalledWith(home);
  });

  it('should update home', async () => {
    const updatedHome: UpdateHomeDto = {
      id: 1,
      description: '',
      title: '',
    };
    jest
      .spyOn(homeRepo, 'update')
      .mockResolvedValueOnce(Promise.resolve(undefined));

    await service.update(updatedHome);
    expect(homeRepo.update).toHaveBeenCalled();
    expect(homeRepo.update).toBeCalledWith(updatedHome.id, updatedHome);
  });

  it('should remove home by id', async () => {
    const id = 1;
    jest
      .spyOn(homeRepo, 'delete')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    await service.remove(id);
    expect(homeRepo.delete).toHaveBeenCalled();
    expect(homeRepo.delete).toBeCalledWith(id);
  });
});
