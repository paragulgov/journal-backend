import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UserIdDecorator } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() dto: CreateArticleDto, @UserIdDecorator() userId: number) {
    return this.articlesService.create(dto, userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getAll() {
    return this.articlesService.getAll();
  }
}
