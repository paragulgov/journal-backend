import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { LikeType } from '../../enums/role.enum';
import { ArticleEntity } from '../../articles/entities/article.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity()
export class LikeToArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: LikeType })
  type: LikeType;

  @ManyToOne(() => ArticleEntity, (article) => article.likes)
  article: ArticleEntity;

  @ManyToOne(() => UserEntity, (user) => user.likesToArticle)
  user: UserEntity;
}
