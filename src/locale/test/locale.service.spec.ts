import { getRepositoryToken } from '@nestjs/typeorm';
import { Locale } from '../locale.entity';
import { LocaleService } from '../locale.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateLocaleDto } from '../dto/create-locale.dto';

describe('LocaleService', () => {
  const localeRepoToken = getRepositoryToken(Locale);
  let service: LocaleService;
  let localeRepo: Repository<Locale>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocaleService,
        {
          provide: localeRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LocaleService>(LocaleService);
    localeRepo = module.get(localeRepoToken);
  });

  it('should defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all locales', async () => {
    const locale = new Locale();
    jest.spyOn(localeRepo, 'find').mockResolvedValueOnce([locale]);
    const findLocales = await service.findAll();

    expect(findLocales).toEqual([locale]);
    expect(localeRepo.find).toHaveBeenCalled();
  });

  it('should get locale by id', async () => {
    const locale = new Locale();
    const id = 1;
    jest.spyOn(localeRepo, 'findOne').mockResolvedValueOnce(locale);
    const findLocale = await service.findById(id);

    expect(findLocale).toEqual(locale);
    expect(localeRepo.findOne).toHaveBeenCalled();
    expect(localeRepo.findOne).toBeCalledWith({
      where: { id },
    });
  });

  it('Should create locale', async () => {
    const newLocale: CreateLocaleDto = { name: 'TEST_LOCALE' };
    const locale = new Locale();
    jest.spyOn(localeRepo, 'create').mockReturnValue(locale);
    jest.spyOn(localeRepo, 'save').mockResolvedValueOnce(locale);

    const createdLocale = await service.create(newLocale);

    expect(createdLocale).toEqual(locale);
    expect(localeRepo.create).toHaveBeenCalled();
    expect(localeRepo.create).toBeCalledWith(newLocale);
    expect(localeRepo.save).toHaveBeenCalled();
    expect(localeRepo.save).toBeCalledWith(locale);
  });

  it('should delete locale', async () => {
    const id = 1;
    jest.spyOn(localeRepo, 'delete').mockResolvedValueOnce(undefined);

    await service.remove(id);

    expect(localeRepo.delete).toHaveBeenCalled();
    expect(localeRepo.delete).toBeCalledWith(id);
  });
});
