import { getRepositoryToken } from '@nestjs/typeorm';
import { Locale } from '../locale.entity';
import { LocaleController } from '../locale.controller';
import { LocaleService } from '../locale.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateLocaleDto } from '../dto/create-locale.dto';

describe('LocaleController', () => {
  const repoToken = getRepositoryToken(Locale);
  let controller: LocaleController;
  let service: LocaleService;
  let repo: Repository<Locale>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocaleController],
      providers: [
        LocaleService,
        {
          provide: repoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<LocaleController>(LocaleController);
    service = module.get<LocaleService>(LocaleService);
    repo = module.get(repoToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  it('should get all locales', async () => {
    const locale = new Locale();
    jest.spyOn(service, 'findAll').mockResolvedValueOnce([locale]);

    const findLocales = await controller.findAll();

    expect(findLocales).toEqual([locale]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get locale by id', async () => {
    const locale = new Locale();
    const id = 1;
    jest.spyOn(service, 'findById').mockResolvedValueOnce(locale);

    const findLocale = await controller.findById(id);

    expect(findLocale).toEqual(locale);
    expect(service.findById).toHaveBeenCalled();
    expect(service.findById).toBeCalledWith(id);
  });

  it('should create locale', async () => {
    const newLocale: CreateLocaleDto = { name: 'TEST_LOCALE' };
    const locale = new Locale();
    jest.spyOn(service, 'create').mockResolvedValueOnce(locale);

    const createdLocale = await controller.create(newLocale);

    expect(createdLocale).toEqual(locale);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toBeCalledWith(newLocale);
  });

  it('should delete locale by id', async () => {
    const id = 1;
    jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

    await controller.remove(id);

    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toBeCalledWith(id);
  });
});
