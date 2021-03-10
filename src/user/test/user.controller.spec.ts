import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUserPasswordDto } from '../dto/update-user-password.dto';

describe('UserController', () => {
  const repoToken = getRepositoryToken(User);
  let controller: UserController;
  let service: UserService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: repoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    repo = module.get(repoToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should find user by id', async () => {
    const id = 1;
    const user = new User();
    jest.spyOn(service, 'findById').mockImplementation(async () => user);

    const returnedUser = await controller.findById(id);

    expect(returnedUser).toEqual(user);
    expect(service.findById).toHaveBeenCalled();
    expect(service.findById).toBeCalledWith(id);
  });

  it('should create user', async () => {
    const user: CreateUserDto = {
      about: '',
      avatar: '',
      email: '',
      firstName: '',
      lastName: '',
      login: '',
      password: '',
    };
    jest.spyOn(service, 'create').mockResolvedValueOnce(undefined);

    const val = await controller.create(user);

    expect(val).toBe(undefined);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toBeCalledWith(user);
  });

  it('should update user', async () => {
    const user: UpdateUserDto = {
      id: 1,
      about: '',
      avatar: '',
      email: '',
      firstName: '',
      lastName: '',
      login: '',
    };
    jest.spyOn(service, 'update').mockResolvedValueOnce(undefined);

    await controller.update(user);

    expect(service.update).toHaveBeenCalled();
    expect(service.update).toBeCalledWith(user);
  });

  it('should update user password', async () => {
    const user: UpdateUserPasswordDto = {
      id: 1,
      newPassword: '',
      newPasswordRepeat: '',
      oldPassword: '',
    };

    jest.spyOn(service, 'updatePassword').mockResolvedValueOnce(undefined);

    await controller.updatePassword(user);

    expect(service.updatePassword).toHaveBeenCalled();
    expect(service.updatePassword).toBeCalledWith(user);
  });

  it('should remove user', async () => {
    const id = 1;
    jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

    await controller.remove(id);

    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toBeCalledWith(id);
  });
});