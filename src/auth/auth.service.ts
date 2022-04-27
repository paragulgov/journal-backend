import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByName(username);
    const isMatch = await bcrypt.compare(pass, user.password);

    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: UserEntity) {
    const payload = { id: user.id, username: user.username, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async registration(dto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(dto.password, salt);

    const createdUser = await this.usersService.create({
      ...dto,
      password: hashPassword,
    });

    const payload = {
      id: createdUser.id,
      username: createdUser.username,
      role: createdUser.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
