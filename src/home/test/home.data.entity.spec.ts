import { getRepositoryToken } from '@nestjs/typeorm';
import { HomeData } from '../home.data.entity';
import { Locale } from '../../locale/locale.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('HomeData entity', () => {
  const homeDataToken = getRepositoryToken(HomeData);
  const localeToken = getRepositoryToken(Locale);
  const homeData = {
    title: 'TEST_HOME_DATA',
    description: 'TEST_HOME_DATA',
  };
  const locale = { name: 'TEST_LOCALE' };
  let homeDataRepo: Repository<HomeData>;
  let localeRepo: Repository<Locale>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    homeDataRepo = module.get(homeDataToken);
    localeRepo = module.get(localeToken);
  });

  it('Should return undefined', async () => {
    expect(await homeDataRepo.findOne()).toBe(undefined);
  });

  it('Should create HomeData', async () => {
    const newLocale = await localeRepo.save(locale);
    const newHomeData = await homeDataRepo.save({
      ...homeData,
      locale: { ...newLocale },
    });

    await localeRepo.delete(newLocale.id);

    expect(!!newHomeData.id).toBe(true);
    expect(newHomeData.locale).toEqual(newLocale);
  });

  it('Should delete HomeData', async () => {
    const newHomeData = await homeDataRepo.save(homeData);

    await homeDataRepo.delete(newHomeData.id);

    expect(await homeDataRepo.findOne(newHomeData.id)).toBe(undefined);
  });
});
