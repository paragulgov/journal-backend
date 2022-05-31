import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UserIdDecorator } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateArticleDto } from './dto/update-article.dto';

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

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/published')
  getMyArticles(@UserIdDecorator() userId: number) {
    return this.articlesService.getMyArticles(userId);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  update(
    @Body() dto: UpdateArticleDto,
    @UserIdDecorator() userId: number,
    @Param('id') id: string,
  ) {
    return this.articlesService.update(dto, userId, id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.articlesService.getOne(id);
  }
}
