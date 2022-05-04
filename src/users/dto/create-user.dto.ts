import { Length } from 'class-validator';
import { UniqueOnDatabase } from '../../validators/UniqueOnDatabse';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto {
  @Length(2, 32, { message: 'Имя аккаунта - от 2 до 32 символов' })
  @UniqueOnDatabase(UserEntity, { message: 'Имя аккаунта - уже занято' })
  username: string;

  @Length(6, 32, { message: 'Пароль - от 6 до 32 символов' })
  password: string;
}
