import { IsArray, IsDefined } from 'class-validator';
import { IArticleContent } from '../types/article.types';

export class CreateArticleDto {
  @IsArray()
  content: IArticleContent[];

  @IsDefined({ message: 'Выберите категорию статьи' })
  categoryId: number;
}
