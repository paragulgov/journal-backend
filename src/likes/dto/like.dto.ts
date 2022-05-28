import { IsDefined } from 'class-validator';
import { LikeType } from '../../enums/role.enum';

export class LikeDto {
  @IsDefined()
  type: LikeType;
}
