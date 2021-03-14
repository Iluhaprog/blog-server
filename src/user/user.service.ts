import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { MismatchPasswordException } from '../exceptions/MismatchPasswordException';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findByLogin(login: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { login } });
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

  async create(user: CreateUserDto): Promise<void> {
    await this.userRepository.save(this.userRepository.create(user));
  }

  async update(user: UpdateUserDto): Promise<void> {
    await this.userRepository.update(user.id, user);
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
