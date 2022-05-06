import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './models/categories.model'


@Injectable()
export class CategoriesService {

    constructor(
        @InjectModel(Category) private categoryRepository: typeof Category,
    ) {}

    async createCategory(dto: CreateCategoryDto): Promise<Category> {
        const category: Category = await this.categoryRepository.create(dto)
        return category
    }

    async updateCategory(dto: UpdateCategoryDto): Promise<Category> {
        const category: Category = await this.categoryRepository.findByPk(dto.categoryId)
        if (!category)
            throw new NotFoundException({ message: 'Category not found' })
        await category.$set('name', dto.name)
        return category
    }

    async deleteCategory(categoryId: number): Promise<Category> {
        const category: Category = await this.categoryRepository.findByPk(categoryId)
        if (!category)
            throw new NotFoundException({ message: 'Category not found' })
        return category
    }

}