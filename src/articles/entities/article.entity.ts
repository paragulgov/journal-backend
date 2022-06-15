import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IArticleContent } from '../types/article.types';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';
import { LikeToArticleEntity } from '../../likes/entities/like-to-article.entity';
import { ArticleStatus } from '../../enums/role.enum';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column({ type: 'jsonb', nullable: false })
  content: IArticleContent[];

  @Column({ default: 0 })
  views: number;

  @Column({ default: false })
  rejected: boolean;

  @Column({ default: '' })
  rejectedReason: string;

  @Column({ type: 'enum', enum: ArticleStatus, default: ArticleStatus.pending })
  status: ArticleStatus;

  @ManyToOne(() => UserEntity, { nullable: false })
  user: UserEntity;

  @ManyToOne(() => CategoryEntity, { nullable: true })
  category: CategoryEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.article)
  comments: CommentEntity[];

  @OneToMany(() => LikeToArticleEntity, (like) => like.article)
  likes: LikeToArticleEntity[];

  // @ManyToOne(() => UserEntity, (object) => object.id)
  // rejectedBy: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
