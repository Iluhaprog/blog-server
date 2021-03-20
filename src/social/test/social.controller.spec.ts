import { Test, TestingModule } from '@nestjs/testing';
import { SocialController } from '../social.controller';
import { SocialService } from '../social.service';
import { Repository } from 'typeorm';
import { Social } from '../social.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateSocialDto } from '../dto/create-social.dto';
import { UpdateSocialDto } from '../dto/update-social.dto';

describe('SocialController', () => {
  const repoToken = getRepositoryToken(Social);
  let controller: SocialController;
  let service: SocialService;
  let repo: Repository<Social>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialController],
      providers: [
        SocialService,
        {
          provide: repoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<SocialController>(SocialController);
    service = module.get<SocialService>(SocialService);
    repo = module.get(repoToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  it('should return all socials', async () => {
    const social = new Social();
    jest.spyOn(service, 'getAll').mockResolvedValueOnce([social]);

    const socials = await controller.getAll();

    expect(socials).toEqual([social]);
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should create social', async () => {
    const social: CreateSocialDto = {
      link: '',
      preview: '',
      title: '',
    };
    const req = { user: { id: 1 } };
    const expectedValue = new Social();
    jest.spyOn(service, 'create').mockResolvedValueOnce(expectedValue);

    const result = await controller.create(req, social);

    expect(result).toEqual(expectedValue);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toBeCalledWith(social, req.user.id);
  });

  it('should update social', async () => {
    const social: UpdateSocialDto = {
      id: 0,
      link: '',
      preview: '',
      title: '',
    };
    jest.spyOn(service, 'update').mockResolvedValueOnce(undefined);

    await controller.update(social);

    expect(service.update).toHaveBeenCalled();
    expect(service.update).toBeCalledWith(social);
  });

  it('should remove social', async () => {
    const id = 1;
    jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

    await controller.remove(id);

    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toBeCalledWith(id);
  });
});
