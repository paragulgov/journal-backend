import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeToArticleEntity } from './entities/like-to-article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LikeToArticleEntity])],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
