import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleEntity } from './entities/article.entity';
import { UpdateArticleDto } from './dto/update-article.dto';
import { LikesService } from '../likes/likes.service';
import { ArticleStatus, LikeType } from '../enums/role.enum';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articlesRepository: Repository<ArticleEntity>,
    private readonly likesService: LikesService,
  ) {}

  async search(dto: any) {
    const qb = this.articlesRepository.createQueryBuilder('a');

    if (dto.value) {
      qb.where(`a.title ILIKE :title`);
      qb.orWhere(`a.subtitle ILIKE :subtitle`);
    }

    qb.setParameters({
      title: `%${dto.value}%`,
      subtitle: `%${dto.value}%`,
    });

    return qb.getMany();
  }

  async create(dto: CreateArticleDto, userId: number) {
    const title = dto.content.find((el) => el?.type === 'header');
    const subtitle = dto.content.find((el) => el?.type === 'paragraph');

    const created = await this.articlesRepository.save({
      ...dto,
      title: title?.data?.text,
      subtitle: subtitle?.data?.text,
      user: { id: userId },
      category: { id: dto.categoryId },
    });

    return this.articlesRepository.findOne(created.id, {
      relations: ['user', 'category'],
    });
  }

  async update(dto: UpdateArticleDto, userId: number, id: string) {
    const article = await this.articlesRepository.findOne(id, {
      relations: ['user'],
    });

    if (article.user.id !== userId) {
      throw new ForbiddenException();
    }

    const title = dto.content.find((el) => el?.type === 'header');
    const subtitle = dto.content.find((el) => el?.type === 'paragraph');

    await this.articlesRepository.update(id, {
      content: dto.content,
      title: title?.data?.text,
      subtitle: subtitle?.data?.text,
      status: ArticleStatus.pending,
      rejected: false,
      rejectedReason: '',
      category: { id: dto.categoryId },
    });

    return this.articlesRepository.findOne(id, {
      relations: ['user', 'category'],
    });
  }

  async acceptPendingArticle(id: string) {
    await this.articlesRepository.update(id, {
      status: ArticleStatus.published,
    });

    return { message: 'Статья одобрена' };
  }

  async rejectPendingArticle(id: string, reason: string) {
    await this.articlesRepository.update(id, {
      status: ArticleStatus.pending,
      rejected: true,
      rejectedReason: reason,
    });

    return { message: 'Статья отклонена' };
  }

  getAll() {
    return this.articlesRepository.find({
      relations: ['user', 'category', 'likes', 'likes.user', 'comments'],
    });
  }

  getPopular() {
    return this.articlesRepository.find({
      where: { status: 'published' },
      order: { views: 'DESC' },
      relations: ['user', 'category', 'likes', 'likes.user', 'comments'],
    });
  }

  getPendingArticles() {
    return this.articlesRepository.find({
      where: { status: 'pending' },
      order: { updatedAt: 'DESC' },
      relations: ['user', 'category', 'likes', 'likes.user', 'comments'],
    });
  }

  async getOne(articleId: string) {
    const article = await this.articlesRepository.findOne(articleId, {
      relations: ['user', 'category', 'likes', 'likes.user'],
    });

    if (article) {
      await this.articlesRepository.update(articleId, {
        views: () => 'views + 1',
      });
    }

    const likesCount = await this.likesService.likesCountToArticle(
      articleId,
      LikeType.Like,
    );

    const dislikesCount = await this.likesService.likesCountToArticle(
      articleId,
      LikeType.Dislike,
    );

    return { ...article, likesCount, dislikesCount };
  }

  async getMyPublishedArticles(userId: number) {
    return await this.articlesRepository.find({
      where: { user: { id: userId }, status: 'published' },
      relations: ['user', 'category', 'comments'],
    });
  }

  async getMyDraftArticles(userId: number) {
    return await this.articlesRepository.find({
      where: { user: { id: userId }, status: 'pending' },
      relations: ['user', 'category', 'comments'],
    });
  }
}
