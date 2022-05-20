import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articlesRepository: Repository<ArticleEntity>,
  ) {}

  async create(dto: CreateArticleDto, userId: number) {
    const created = await this.articlesRepository.save({
      ...dto,
      user: { id: userId },
      category: { id: dto.categoryId },
    });

    return this.articlesRepository.findOne(created.id, {
      relations: ['user', 'category'],
    });
  }

  getAll() {
    return this.articlesRepository.find({ relations: ['user', 'category'] });
  }
}
