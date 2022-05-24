import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleEntity } from './entities/article.entity';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articlesRepository: Repository<ArticleEntity>,
  ) {}

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
      category: { id: dto.categoryId },
    });

    return this.articlesRepository.findOne(id, {
      relations: ['user', 'category'],
    });
  }

  getAll() {
    return this.articlesRepository.find({ relations: ['user', 'category'] });
  }

  getOne(id: string) {
    return this.articlesRepository.findOne(id, {
      relations: ['user', 'category'],
    });
  }
}
