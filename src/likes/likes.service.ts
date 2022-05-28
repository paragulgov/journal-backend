import { Injectable } from '@nestjs/common';
import { LikeDto } from './dto/like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeToArticleEntity } from './entities/like-to-article.entity';
import { LikeType } from '../enums/role.enum';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikeToArticleEntity)
    private repository: Repository<LikeToArticleEntity>,
  ) {}

  async createLikeToArticle(dto: LikeDto, articleId: string, userId: number) {
    const check = await this.checkLikeToArticle(articleId, userId);

    if (check) {
      await this.repository.delete(check);
    }

    if (dto.type === LikeType.Like) {
      if (check && check.type === LikeType.Like) {
        return { message: 'Лайк убран', type: 'unlike' };
      }

      return this.repository.save({
        ...dto,
        message: 'Лайк установлен',
        article: { id: Number(articleId) },
        user: { id: userId },
      });
    }

    if (dto.type === LikeType.Dislike) {
      if (check && check.type === LikeType.Dislike) {
        return { message: 'Дизлайк убран', type: 'undislike' };
      }

      return this.repository.save({
        ...dto,
        message: 'Дизлайк установлен',
        article: { id: Number(articleId) },
        user: { id: userId },
      });
    }
  }

  async checkLikeToArticle(articleId: string, userId: number) {
    return this.repository.findOne({
      where: {
        user: { id: userId },
        article: { id: articleId },
      },
    });
  }

  async likesCountToArticle(articleId: string, type: LikeType) {
    return this.repository.count({
      where: {
        article: { id: articleId },
        type: type,
      },
    });
  }
}
