import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { ArticleEntity } from './entities/article.entity';
import { LikesModule } from '../likes/likes.module';

@Module({
  imports: [LikesModule, TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
