import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LikeType } from '../../enums/role.enum';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';

@Entity()
export class LikeToCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: LikeType })
  type: LikeType;

  @ManyToOne(() => CommentEntity, (comment) => comment.likes)
  comment: CommentEntity;

  @ManyToOne(() => UserEntity, (user) => user.likesToArticle)
  user: UserEntity;
}
