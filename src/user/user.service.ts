import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { MismatchPasswordException } from '../exceptions/MismatchPasswordException';
import { UserData } from './user.data.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserData)
    private userDataRepository: Repository<UserData>,
  ) {}

  async addData(localeId: number, userId: number) {
    const findUser = await this.userRepository.findOne(userId);
    const newUserData = await this.userDataRepository.save({
      firstName: '',
      lastName: '',
      about: '',
      locale: { id: localeId },
    });
    await this.userRepository.save({
      ...findUser,
      userData: [newUserData],
    });
    return await this.userRepository.findOne(userId, {
      relations: ['userData', 'userData.locale'],
    });
  }

  async findAll(): Promise<any> {
    return await this.userRepository.find({
      relations: ['userData', 'userData.locale'],
    });
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne(id, {
      relations: ['userData', 'userData.locale'],
    });
  }

  async findByLogin(login: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      relations: ['userData', 'userData.locale'],
      where: { login },
    });
  }

  async findByLoginAndPassword(
    login: string,
    password: string,
  ): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        login,
        password,
      },
    });
  }

  async create(user: CreateUserDto): Promise<any> {
    const newUser = await this.userRepository.save(
      this.userRepository.create(user),
    );
    await Promise.all(
      user.userData.map(async (userData) => {
        return await this.userDataRepository.save(
          this.userDataRepository.create({
            ...userData,
            user: { id: newUser.id },
          }),
        );
      }),
    );
    return newUser;
  }

  async update(user: UpdateUserDto): Promise<void> {
    await Promise.all(
      user.userData.map(async (userData) => {
        return await this.userDataRepository.save(
          this.userDataRepository.create(userData),
        );
      }),
    );
    await this.userRepository.save(user);
  }

  async updatePassword(user: UpdateUserPasswordDto): Promise<void> {
    const oldUser = await this.userRepository.findOne(user.id);
    if (
      !compareSync(user.oldPassword, oldUser.password) ||
      user.newPassword !== user.newPasswordRepeat
    ) {
      throw new MismatchPasswordException();
    }
    await this.userRepository.save({
      id: user.id,
      password: hashSync(user.newPassword, 10),
    });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
