import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenService } from '../refresh-token.service';
import { Repository } from 'typeorm';
import { RefreshToken } from '../refresh-token.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import * as moment from 'moment';

describe('RefreshTokenService', () => {
  const repoToken = getRepositoryToken(RefreshToken);
  const refreshToken: RefreshToken = {
    id: 1,
    token: 'test',
    expireIn: new Date(),
    user: new User(),
  };
  let service: RefreshTokenService;
  let repo: Repository<RefreshToken>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        {
          provide: repoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
    repo = module.get(repoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check token expire', () => {
    const expireIn1 = moment(new Date()).add(-1, 'M');
    const expireIn2 = moment(new Date()).add(1, 'M');

    expect(service.isValid(expireIn1)).toBe(false);
    expect(service.isValid(expireIn2)).toBe(true);
  });

  it('should get refresh token by token string', async () => {
    const token = 'test';
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(refreshToken);
    await service.get(token);
    expect(repo.findOne).toHaveBeenCalled();
    expect(repo.findOne).toBeCalledWith({ where: { token } });
  });

  it('should create new refresh token', async () => {
    const rt = new RefreshToken();
    jest.spyOn(repo, 'create').mockReturnValue(rt);
    jest.spyOn(repo, 'save').mockResolvedValueOnce(rt);
    const savedRT = await service.create(1);
    expect(savedRT).toEqual(rt);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should remove refresh token by token and userId', async () => {
    jest
      .spyOn(repo, 'delete')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    const userId = 1;
    const token = '1234';
    await service.remove(token, userId);
    expect(repo.delete).toHaveBeenCalled();
    expect(repo.delete).toBeCalledWith({
      token,
      user: { id: userId },
    });
  });

  it('should remove refresh token by userId', async () => {
    jest
      .spyOn(repo, 'delete')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    const userId = 1;
    await service.removeByUserId(userId);
    expect(repo.delete).toHaveBeenCalled();
    expect(repo.delete).toBeCalledWith({
      user: { id: userId },
    });
  });
});
