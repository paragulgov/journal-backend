import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { Role } from '../enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  create(dto: CreateUserDto) {
    return this.usersRepository.save(dto);
  }

  getAll() {
    return this.usersRepository.find();
  }

  findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  findByName(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  giveModer(id: number) {
    return this.usersRepository.save({ id, role: Role.Moderator });
  }

  takeModer(id: number) {
    return this.usersRepository.save({ id, role: Role.User });
  }
}
