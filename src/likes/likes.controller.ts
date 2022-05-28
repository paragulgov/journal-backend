import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikeDto } from './dto/like.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserIdDecorator } from '../decorators/user.decorator';

@Controller('like')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('article/:id')
  createLikeToArticle(
    @Body() dto: LikeDto,
    @Param('id') articleId: string,
    @UserIdDecorator() userId: number,
  ) {
    return this.likesService.createLikeToArticle(dto, articleId, userId);
  }
}
