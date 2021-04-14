import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { hashSync } from 'bcrypt';
import { UpdateUserPasswordDto } from '../dto/update-user-password.dto';
import { MismatchPasswordException } from '../../exceptions/MismatchPasswordException';
import { UserData } from '../user.data.entity';

describe('UserService', () => {
  const newCred: UpdateUserPasswordDto = {
    id: 1,
    newPassword: '87654321',
    newPasswordRepeat: '87654321',
    oldPassword: '12345678',
  };
  const oldUser: User = {
    avatar: '',
    email: '',
    id: 1,
    userData: [],
    login: '',
    skills: '',
    password: hashSync('12345678', 10),
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
  const repoToken = getRepositoryToken(User);
  const userDataToken = getRepositoryToken(UserData);
  let service: UserService;
  let repo: Repository<User>;
  let userDataRepo: Repository<UserData>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: repoToken,
          useClass: Repository,
        },
        {
          provide: userDataToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(repoToken);
    userDataRepo = module.get<Repository<UserData>>(userDataToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create user data for user', async () => {
    const user = new User();
    const userData = new UserData();
    jest.spyOn(repo, 'findOne').mockResolvedValue(user);
    jest.spyOn(userDataRepo, 'save').mockResolvedValueOnce(userData);
    jest.spyOn(repo, 'save').mockResolvedValueOnce(undefined);
    const localeId = 1;
    const userId = 1;

    await service.addData(localeId, userId);

    expect(repo.findOne).toHaveBeenCalledTimes(2);
    expect(userDataRepo.save).toHaveBeenCalled();
    expect(userDataRepo.save).toBeCalledWith({
      firstName: '',
      lastName: '',
      about: '',
      locale: { id: localeId },
    });
    expect(repo.save).toHaveBeenCalled();
    expect(repo.save).toBeCalledWith({
      ...user,
      userData: [userData],
    });
  });

  it('should get all users', async () => {
    const testUser: User = new User();
    jest.spyOn(repo, 'find').mockResolvedValueOnce([testUser]);
    expect(await service.findAll()).toEqual([testUser]);
  });

  it('should get user by id', async () => {
    const testUser: User = new User();
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(testUser);
    expect(await service.findById(1)).toEqual(testUser);
  });

  it('should get user by login', async () => {
    const testUser: User = new User();
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(testUser);
    expect(await service.findByLogin('login')).toEqual(testUser);
  });

  it('should get user by login and password', async () => {
    const testUser: User = new User();
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(testUser);
    expect(await service.findByLoginAndPassword('test', 'test')).toEqual(
      testUser,
    );
  });

  it('should create and save user', async () => {
    const testUser: User = new User();
    const dto: CreateUserDto = {
      avatar: '',
      email: '',
      userData: [],
      login: '',
      password: '',
    };
    jest.spyOn(userDataRepo, 'create').mockReturnValue(undefined);
    jest.spyOn(userDataRepo, 'save').mockResolvedValueOnce(undefined);
    jest.spyOn(repo, 'create').mockReturnValue(testUser);
    jest.spyOn(repo, 'save').mockResolvedValueOnce(new User());

    const result = await service.create(dto);

    expect(result).toEqual(new User());
    expect(repo.create).toHaveBeenCalled();
    expect(repo.create).toBeCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should update user', async () => {
    const userData = {
      id: 1,
      firstName: 'string',
      lastName: 'strnig',
      about: 'about',
    };
    const dto: UpdateUserDto = {
      id: 1,
      avatar: '',
      email: '',
      userData: [userData],
      login: '',
    };
    jest.spyOn(repo, 'save').mockResolvedValueOnce(Promise.resolve(undefined));
    jest.spyOn(userDataRepo, 'create').mockReturnValue(undefined);
    jest.spyOn(userDataRepo, 'save').mockResolvedValueOnce(undefined);
    await service.update(dto);
    expect(repo.save).toHaveBeenCalled();
    expect(repo.save).toBeCalledWith(dto);
    expect(userDataRepo.create).toBeCalledWith(userData);
    expect(userDataRepo.save).toHaveBeenCalled();
  });

  it('should update user password', async () => {
    jest.spyOn(repo, 'save').mockResolvedValueOnce(Promise.resolve(undefined));
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(oldUser);

    await service.updatePassword(newCred);

    expect(repo.findOne).toHaveBeenCalled();
    expect(repo.findOne).toBeCalledWith(newCred.id);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw MismatchPasswordException when old password mismatch with current user password', async () => {
    jest
      .spyOn(repo, 'update')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(oldUser);
    let error;
    try {
      await service.updatePassword({ ...newCred, oldPassword: '1234' });
    } catch (e) {
      error = e;
    }
    expect(error instanceof MismatchPasswordException).toBe(true);
  });

  it('should throw MismatchPasswordException when newPassword and newPasswordRepeat mismatch', async () => {
    jest
      .spyOn(repo, 'update')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(oldUser);
    let error;
    try {
      await service.updatePassword({ ...newCred, newPasswordRepeat: '1234' });
    } catch (e) {
      error = e;
    }
    expect(error instanceof MismatchPasswordException).toBe(true);
  });

  it('should remove user', async () => {
    const id = 1;
    jest
      .spyOn(repo, 'delete')
      .mockResolvedValueOnce(Promise.resolve(undefined));
    await service.remove(id);
    expect(repo.delete).toHaveBeenCalled();
    expect(repo.delete).toBeCalledWith(id);
  });
});
