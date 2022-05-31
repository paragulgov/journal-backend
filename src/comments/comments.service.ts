import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentsRepository: Repository<CommentEntity>,
  ) {}

  async create(dto: CreateCommentDto, articleId: number, userId: number) {
    const created = await this.commentsRepository.save({
      ...dto,
      user: { id: userId },
      article: { id: articleId },
    });

    return this.commentsRepository.findOne(created.id, {
      relations: ['user'],
    });
  }

  findAll() {
    return this.commentsRepository.find({ relations: ['user', 'article'] });
  }

  findOne(id: number) {
    return this.commentsRepository.find({
      where: { article: { id: id } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  findMyComments(userId: number) {
    return this.commentsRepository.find({
      where: { user: { id: userId } },
      relations: ['article'],
    });
  }

  update(id: number, dto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
