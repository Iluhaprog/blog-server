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

describe('UserService', () => {
  const newCred: UpdateUserPasswordDto = {
    id: 1,
    newPassword: '87654321',
    newPasswordRepeat: '87654321',
    oldPassword: '12345678',
  };
  const oldUser: User = {
    about: '',
    avatar: '',
    email: '',
    firstName: '',
    id: 1,
    lastName: '',
    login: '',
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
  let service: UserService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: repoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(repoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      about: '',
      avatar: '',
      email: '',
      firstName: '',
      lastName: '',
      login: '',
      password: '',
    };
    jest.spyOn(repo, 'create').mockReturnValue(testUser);
    jest.spyOn(repo, 'save').mockResolvedValueOnce(new User());
    await service.create(dto);

    expect(repo.create).toHaveBeenCalled();
    expect(repo.create).toBeCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should update user', async () => {
    const dto: UpdateUserDto = {
      id: 1,
      about: '',
      avatar: '',
      email: '',
      firstName: '',
      lastName: '',
      login: '',
    };
    jest.spyOn(repo, 'update').mockResolvedValueOnce(Promise.resolve(undefined));
    await service.update(dto);
    expect(repo.update).toHaveBeenCalled();
    expect(repo.update).toBeCalledWith(dto.id, dto);
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
