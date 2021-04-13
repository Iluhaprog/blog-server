import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { RefreshTokenService } from '../../refresh-token/refresh-token.service';
import { UserService } from '../../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { RefreshToken } from '../../refresh-token/refresh-token.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserData } from "../../user/user.data.entity";

describe('AuthController', () => {
  const usRepoToken = getRepositoryToken(User);
  const userDataToken = getRepositoryToken(UserData);
  const rtRepoToken = getRepositoryToken(RefreshToken);
  let controller: AuthController;
  let service: AuthService;
  let rtService: RefreshTokenService;
  let usService: UserService;
  let usRepo: Repository<User>;
  let rtRepo: Repository<RefreshToken>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({}),
        JwtModule.register({
          secret: process.env.SECRET,
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        UserService,
        RefreshTokenService,
        AuthService,
        {
          provide: usRepoToken,
          useClass: Repository,
        },
        {
          provide: rtRepoToken,
          useClass: Repository,
        },
        {
          provide: userDataToken,
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    rtService = module.get<RefreshTokenService>(RefreshTokenService);
    usService = module.get<UserService>(UserService);
    rtRepo = module.get(rtRepoToken);
    usRepo = module.get(usRepoToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(rtService).toBeDefined();
    expect(usService).toBeDefined();
    expect(rtRepo).toBeDefined();
    expect(usRepo).toBeDefined();
  });

  it('should login', async () => {
    const data = {
      accessToken: '',
      refreshToken: '',
    };
    const req = { user: { id: 1 } };
    jest.spyOn(service, 'login').mockResolvedValueOnce(data);

    const responce = await controller.login(req);

    expect(responce).toEqual(data);
    expect(service.login).toHaveBeenCalled();
    expect(service.login).toBeCalledWith(req.user);
  });

  it('should create a new pair of refresh and access tokens', async () => {
    const data = {
      accessToken: '',
      refreshToken: '',
    };
    const token = 'TEST_TOKEN';
    const req = { user: { id: 1 } };
    jest.spyOn(service, 'refresh').mockResolvedValueOnce(data);

    const responce = await controller.refreshToken(token, req);

    expect(responce).toEqual(data);
    expect(service.refresh).toHaveBeenCalled();
    expect(service.refresh).toBeCalledWith(token, req.user.id);
  });

  it('should delete refresh token', async () => {
    const token = 'TEST_TOKEN';
    const req = { user: { id: 1 } , logout: () => {} };

    jest.spyOn(service, 'logout').mockResolvedValueOnce(undefined);

    await controller.logout(token, req);

    expect(service.logout).toHaveBeenCalled();
    expect(service.logout).toBeCalledWith(token, req.user.id);
  });

  it('should delete all refresh tokens', async () => {
    const req = { user: { id: 1 }, logout: () => {} };

    jest.spyOn(service, 'logoutAll').mockResolvedValueOnce(undefined);

    await controller.logoutAll(req);

    expect(service.logoutAll).toHaveBeenCalled();
    expect(service.logoutAll).toBeCalledWith(req.user.id);
  });
});
