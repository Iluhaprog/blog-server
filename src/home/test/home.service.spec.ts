import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from '../home.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Home } from '../home.entity';
import { Repository } from 'typeorm';
import { CreateHomeDto } from '../dto/create-home.dto';
import { UpdateHomeDto } from '../dto/update-home.dto';
import { HomeData } from '../home.data.entity';

describe('HomeService', () => {
  const homeRepoToken = getRepositoryToken(Home);
  const homeDataRepoToken = getRepositoryToken(HomeData);
  let service: HomeService;
  let homeRepo: Repository<Home>;
  let homeDataRepo: Repository<HomeData>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: homeRepoToken,
          useClass: Repository,
        },
        {
          provide: homeDataRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    homeRepo = module.get(homeRepoToken);
    homeDataRepo = module.get(homeDataRepoToken);
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
      relations: ['homeData', 'homeData.locale'],
      where: {
        selected: true,
      },
    });
  });

  it('should get all homes', async () => {
    const home = new Home();
    jest.spyOn(homeRepo, 'find').mockResolvedValueOnce([home]);
    const findHomes = await service.getAll();

    expect(findHomes).toEqual([home]);
    expect(homeRepo.find).toHaveBeenCalled();
    expect(homeRepo.find).toBeCalledWith({
      relations: ['homeData', 'homeData.locale'],
    });
  });

  it('should add home data', async () => {
    const home = new Home();
    const homeData = new HomeData();
    const [localeId, homeId] = [1, 1];
    jest.spyOn(homeRepo, 'findOne').mockResolvedValueOnce(home);
    jest.spyOn(homeRepo, 'save').mockResolvedValueOnce(home);
    jest.spyOn(homeDataRepo, 'save').mockResolvedValueOnce(homeData);

    const result = await service.addData(localeId, homeId);

    expect(result).toEqual(homeData);
    expect(homeRepo.findOne).toHaveBeenCalled();
    expect(homeRepo.findOne).toBeCalledWith(homeId);
    expect(homeRepo.save).toHaveBeenCalled();
    expect(homeRepo.save).toBeCalledWith({
      ...home,
      homeData: [homeData],
    });
    expect(homeDataRepo.save).toHaveBeenCalled();
    expect(homeDataRepo.save).toBeCalledWith({
      title: '',
      description: '',
      locale: { id: localeId },
    });
  });

  it('should create home', async () => {
    const newHome: CreateHomeDto = {
      homeData: [],
    };
    const home = new Home();
    const homeData = new HomeData();
    jest.spyOn(homeRepo, 'create').mockReturnValue(home);
    jest.spyOn(homeRepo, 'save').mockResolvedValueOnce(Promise.resolve(home));
    jest.spyOn(homeDataRepo, 'save').mockResolvedValueOnce(homeData);
    jest.spyOn(homeDataRepo, 'create').mockReturnValue(homeData);
    jest.spyOn(homeRepo, 'findOne').mockResolvedValueOnce(home);
    const result = await service.create(newHome);

    expect(result).toEqual(home);
    expect(homeRepo.create).toHaveBeenCalled();
    expect(homeRepo.create).toBeCalledWith(newHome);
    expect(homeRepo.save).toHaveBeenCalled();
    expect(homeRepo.save).toBeCalledWith(home);
  });

  it('should update home', async () => {
    const testHomeData = {
      id: 1,
      title: 'HOME_TITLE',
      description: 'HOME_DESCRIPTION',
    };
    const updatedHome: UpdateHomeDto = {
      id: 1,
      homeData: [testHomeData],
    };
    jest
      .spyOn(homeRepo, 'save')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    jest.spyOn(homeDataRepo, 'save').mockResolvedValueOnce(undefined);
    jest.spyOn(homeDataRepo, 'create').mockReturnValue(undefined);

    await service.update(updatedHome);
    expect(homeRepo.save).toHaveBeenCalled();
    expect(homeRepo.save).toBeCalledWith(updatedHome);
    expect(homeDataRepo.save).toHaveBeenCalled();
    expect(homeDataRepo.create).toHaveBeenCalled();
    expect(homeDataRepo.create).toBeCalledWith(testHomeData);
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
