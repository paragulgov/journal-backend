import { MinLength } from 'class-validator';

export class CreateCommentDto {
  @MinLength(1, { message: 'Введите текст комментария' })
  text: string;
}
