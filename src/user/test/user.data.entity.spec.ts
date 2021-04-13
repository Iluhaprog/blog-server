import { getRepositoryToken } from '@nestjs/typeorm';
import { UserData } from '../user.data.entity';
import { Locale } from '../../locale/locale.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('UserData entity', () => {
  const userDataToken = getRepositoryToken(UserData);
  const localeToken = getRepositoryToken(Locale);
  const locale = { name: 'TEST_LOCALE' };
  const userData = {
    title: 'TEST_TITLE',
    description: 'TEST_DESCRIPTION',
    about: '',
  };
  let userDataRepo: Repository<UserData>;
  let localeRepo: Repository<Locale>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userDataRepo = module.get(userDataToken);
    localeRepo = module.get(localeToken);
  });

  it('Should return undefined', async () => {
    expect(await userDataRepo.findOne()).toBe(undefined);
  });

  it('Should create userData', async () => {
    const savedLocale = await localeRepo.save(locale);
    const savedUserData = await userDataRepo.save({
      ...userData,
      locale: savedLocale,
    });

    await localeRepo.delete(savedLocale.id);

    expect(!!savedUserData).toBe(true);
    expect(savedUserData.locale).toEqual(savedLocale);
  });

  it('Should delete userData', async () => {
    const savedUserData = await userDataRepo.save(userData);
    await userDataRepo.delete(savedUserData.id);
    expect(await userDataRepo.findOne(savedUserData.id)).toBe(undefined);
  });
});
