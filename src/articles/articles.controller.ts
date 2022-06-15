import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UserIdDecorator } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateArticleDto } from './dto/update-article.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() dto: CreateArticleDto, @UserIdDecorator() userId: number) {
    return this.articlesService.create(dto, userId);
  }

  @Get('/search')
  searchPosts(@Query() dto: any) {
    return this.articlesService.search(dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Moderator)
  @Get('pending')
  getPendingArticles() {
    return this.articlesService.getPendingArticles();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Moderator)
  @Post('pending/accept/:id')
  acceptPendingArticle(@Param('id') id: string) {
    return this.articlesService.acceptPendingArticle(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Moderator)
  @Post('pending/reject/:id')
  rejectPendingArticle(@Param('id') id: string, @Body() dto: any) {
    return this.articlesService.rejectPendingArticle(id, dto.reason);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('popular')
  getAll() {
    return this.articlesService.getPopular();
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/published')
  getMyArticles(@UserIdDecorator() userId: number) {
    return this.articlesService.getMyPublishedArticles(userId);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/drafts')
  getMyDraftArticles(@UserIdDecorator() userId: number) {
    return this.articlesService.getMyDraftArticles(userId);
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
