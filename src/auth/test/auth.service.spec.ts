import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { RefreshTokenService } from '../../refresh-token/refresh-token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { RefreshToken } from '../../refresh-token/refresh-token.entity';
import { Repository } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { hashSync } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { ConfigModule } from '@nestjs/config';
import * as moment from 'moment';
import { UnauthorizedException } from '@nestjs/common';
import { UserData } from '../../user/user.data.entity';

describe('AuthService', () => {
  const userToken = getRepositoryToken(User);
  const userDataToken = getRepositoryToken(UserData);
  const rtToken = getRepositoryToken(RefreshToken);
  const pass = '12345678';
  const passHash = hashSync(pass, 10);
  const user: User = {
    avatar: '',
    skills: '',
    email: '',
    id: 0,
    userData: [],
    login: 'test',
    password: passHash,
    posts: [],
    projects: [],
    refreshTokens: [],
    socials: [],
    async hashPassword(): Promise<void> {
      return Promise.resolve(undefined);
    },
    async validate(): Promise<void> {
      return Promise.resolve(undefined);
    },
  };
  const refreshTokenData: RefreshToken = {
    id: 1,
    token: uuid(),
    expireIn: new Date(moment(new Date()).add(1, 'M').valueOf()),
    user: undefined,
  };
  let authService: AuthService;
  let userService: UserService;
  let refreshTokenService: RefreshTokenService;
  let userRepo: Repository<User>;
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
      providers: [
        AuthService,
        UserService,
        RefreshTokenService,
        {
          provide: userToken,
          useClass: Repository,
        },
        {
          provide: rtToken,
          useClass: Repository,
        },
        {
          provide: userDataToken,
          useClass: Repository,
        },
      ],
    }).compile();

    userRepo = module.get(userToken);
    rtRepo = module.get(rtToken);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(refreshTokenService).toBeDefined();
  });

  it('should validate user (successfully)', async () => {
    jest.spyOn(userService, 'findByLogin').mockResolvedValueOnce(user);
    const validUser = await authService.validateUser(user.login, pass);
    expect(validUser).toEqual(user);
    expect(userService.findByLogin).toHaveBeenCalled();
    expect(userService.findByLogin).toBeCalledWith(user.login);
  });

  it('should validate user (with failure)', async () => {
    const pass = 'INVALID_PASSWORD',
      login = 'login';
    jest.spyOn(userService, 'findByLogin').mockResolvedValueOnce(user);
    const validUser = await authService.validateUser(login, pass);
    expect(validUser).toBe(undefined);
    expect(userService.findByLogin).toHaveBeenCalled();
    expect(userService.findByLogin).toBeCalledWith(login);
  });

  it('should login', async () => {
    jest
      .spyOn(refreshTokenService, 'create')
      .mockResolvedValueOnce(refreshTokenData);

    const tokens = await authService.login(user);
    expect(typeof tokens.refreshToken === 'string').toBe(true);
    expect(typeof tokens.accessToken === 'string').toBe(true);
    expect(refreshTokenService.create).toHaveBeenCalled();
    expect(refreshTokenService.create).toBeCalledWith(user.id);
  });

  it('should create new access and refresh token', async () => {
    jest
      .spyOn(refreshTokenService, 'get')
      .mockResolvedValueOnce(refreshTokenData);
    jest
      .spyOn(refreshTokenService, 'create')
      .mockResolvedValueOnce(refreshTokenData);
    jest
      .spyOn(refreshTokenService, 'remove')
      .mockResolvedValueOnce(Promise.resolve(undefined));

    const tokenString = 'TEST_TOKEN_STRING';
    const userId = 1;
    const tokens = await authService.refresh(tokenString, userId);

    expect(typeof tokens.refreshToken === 'string').toBe(true);
    expect(typeof tokens.accessToken === 'string').toBe(true);
    expect(refreshTokenService.get).toHaveBeenCalled();
    expect(refreshTokenService.get).toBeCalledWith(tokenString);
    expect(refreshTokenService.create).toHaveBeenCalled();
    expect(refreshTokenService.create).toBeCalledWith(userId);
    expect(refreshTokenService.remove).toHaveBeenCalled();
    expect(refreshTokenService.remove).toBeCalledWith(tokenString, userId);
  });

  it('should create new access and refresh token (invalid expireIn)', async () => {
    jest
      .spyOn(refreshTokenService, 'get')
      .mockResolvedValueOnce({ ...refreshTokenData, expireIn: new Date() });

    const tokenString = 'TEST_TOKEN_STRING';
    const userId = 1;
    let error;
    try {
      await authService.refresh(tokenString, userId);
    } catch (e) {
      error = e;
    }
    expect(error instanceof UnauthorizedException).toBe(true);
  });

  it('should create new access and refresh token (prev token is undefined)', async () => {
    jest.spyOn(refreshTokenService, 'get').mockResolvedValueOnce(undefined);

    const tokenString = 'TEST_TOKEN_STRING';
    const userId = 1;
    let error;
    try {
      await authService.refresh(tokenString, userId);
    } catch (e) {
      error = e;
    }
    expect(error instanceof UnauthorizedException).toBe(true);
  });

  it('should logout', async () => {
    jest
      .spyOn(refreshTokenService, 'remove')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    const token = uuid();
    const userId = 1;
    await authService.logout(token, userId);
    expect(refreshTokenService.remove).toHaveBeenCalled();
    expect(refreshTokenService.remove).toBeCalledWith(token, userId);
  });

  it('should logout from all', async () => {
    jest
      .spyOn(refreshTokenService, 'removeByUserId')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    const userId = 1;
    await authService.logoutAll(userId);
    expect(refreshTokenService.removeByUserId).toHaveBeenCalled();
    expect(refreshTokenService.removeByUserId).toBeCalledWith(userId);
  });
});
