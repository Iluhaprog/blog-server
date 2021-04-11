import { getRepositoryToken } from '@nestjs/typeorm';
import { Locale } from '../locale.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('Locale entity', () => {
  const localeToken = getRepositoryToken(Locale);
  const locale = {
    name: 'LOCALE_NAME',
  };
  let localeRepo: Repository<Locale>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    localeRepo = module.get(localeToken);
  });

  it('Should return undefined', async () => {
    expect(await localeRepo.findOne()).toBe(undefined);
  });

  it('Should create locale', async () => {
    const savedLocale = await localeRepo.save(await localeRepo.create(locale));
    await localeRepo.delete(savedLocale.id);

    expect(!!savedLocale.id).toBe(true);
  });

  it('Should delete locale', async () => {
    const savedLocale = await localeRepo.save(await localeRepo.create(locale));
    await localeRepo.delete(savedLocale.id);

    expect(await localeRepo.findOne(savedLocale.id)).toBe(undefined);
  });
});
