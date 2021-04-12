import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../project.entity';
import { ProjectData } from '../project.data.entity';
import { Repository } from 'typeorm';
import { User } from '../../user/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { Locale } from '../../locale/locale.entity';

describe('ProjectData entity', () => {
  const localeToken = getRepositoryToken(Locale);
  const projectDataToken = getRepositoryToken(ProjectData);
  const projectData = {
    title: 'TEST_TITLE',
    description: 'TEST_DESCRIPTION',
  };
  let projectDataRepo: Repository<ProjectData>;
  let localeRepo: Repository<Locale>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    projectDataRepo = module.get(projectDataToken);
    localeRepo = module.get(localeToken);
  });

  it('Should return undefined', async () => {
    expect(await projectDataRepo.findOne()).toBe(undefined);
  });

  it('Should create project data', async () => {
    const locale = await localeRepo.save({ name: 'Test' });
    const savedProjectData = await projectDataRepo.save(
      projectDataRepo.create({
        ...projectData,
        locale,
      }),
    );
    await localeRepo.delete(locale.id);

    expect(!!savedProjectData.id).toBe(true);
    expect(savedProjectData.locale).toEqual(locale);
  });

  it('Should delete project data', async () => {
    const locale = await localeRepo.save({ name: 'Test' });
    const savedProjectData = await projectDataRepo.save(
      projectDataRepo.create({
        ...projectData,
        locale,
      }),
    );
    await projectDataRepo.delete(savedProjectData.id);
    await localeRepo.delete(locale.id);

    expect(await projectDataRepo.findOne(savedProjectData.id)).toBe(undefined);
  });
});
