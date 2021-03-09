import { Test, TestingModule } from '@nestjs/testing';
import { SocialService } from '../social.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Social } from '../social.entity';
import { Repository } from 'typeorm';
import { CreateSocialDto } from '../dto/create-social.dto';
import { UpdateSocialDto } from '../dto/update-social.dto';

describe('SocialService', () => {
  const socialRepoToken = getRepositoryToken(Social);
  let service: SocialService;
  let socRepo: Repository<Social>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialService,
        {
          provide: socialRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SocialService>(SocialService);
    socRepo = module.get(socialRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all socials', async () => {
    const social = new Social();
    jest.spyOn(socRepo, 'find').mockResolvedValueOnce([social]);
    const socials = await service.getAll();
    expect(socials).toEqual([social]);
    expect(socRepo.find).toHaveBeenCalled();
  });

  it('should create social', async () => {
    const social = new Social();
    const userId = 1;
    const newSocial: CreateSocialDto = {
      link: '',
      preview: '',
      title: '',
    };
    jest.spyOn(socRepo, 'create').mockReturnValue(social);
    jest
      .spyOn(socRepo, 'save')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    await service.create(newSocial, userId);
    expect(socRepo.create).toHaveBeenCalled();
    expect(socRepo.create).toBeCalledWith({
      ...newSocial,
      user: { id: userId },
    });
    expect(socRepo.save).toHaveBeenCalled();
    expect(socRepo.save).toBeCalledWith(social);
  });

  it('update update social', async () => {
    const updatedSocial: UpdateSocialDto = {
      id: 1,
      link: '',
      preview: '',
      title: '',
    };
    jest
      .spyOn(socRepo, 'update')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    await service.update(updatedSocial);
    expect(socRepo.update).toHaveBeenCalled();
    expect(socRepo.update).toBeCalledWith(updatedSocial.id, updatedSocial);
  });

  it('should remove social', async () => {
    const id = 1;
    jest
      .spyOn(socRepo, 'delete')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    await service.remove(id);
    expect(socRepo.delete).toHaveBeenCalled();
    expect(socRepo.delete).toBeCalledWith(id);
  });
});
