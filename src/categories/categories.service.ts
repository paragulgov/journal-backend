import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>,
  ) {}

  create(dto: CreateCategoryDto) {
    return this.categoriesRepository.save(dto);
  }

  // update(id: number, dto: UpdateCategoryDto) {
  //   return this.categoriesRepository.update(id, dto);
  // }

  remove(id: number) {
    return this.categoriesRepository.delete(id);
  }

  findAll() {
    return this.categoriesRepository.find();
  }
}
