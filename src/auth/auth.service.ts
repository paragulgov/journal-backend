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

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);

      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(user: UserEntity) {
    const payload = { id: user.id, username: user.username, role: user.role };

    return {
      userInfo: user,
      token: this.jwtService.sign(payload),
    };
  }

  async register(dto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(dto.password, salt);

    const { password, ...registerUser } = await this.usersService.create({
      ...dto,
      password: hashPassword,
    });

    const payload = {
      id: registerUser.id,
      username: registerUser.username,
      role: registerUser.role,
    };

    return {
      userInfo: registerUser,
      token: this.jwtService.sign(payload),
    };
  }
}
