import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateCategoryDto } from './dto/create-category.dto'
import { DeleteCategoryDto } from './dto/delete-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './models/categories.model'


@Injectable()
export class CategoriesService {

    constructor(
        @InjectModel(Category) private categoryRepository: typeof Category,
    ) {}

    async getCategoryById(categoryId): Promise<Category> {
        const category: Category = await this.categoryRepository.findByPk(categoryId)
        return category
    }

    async createCategory(dto: CreateCategoryDto): Promise<Category> {
        const category: Category = await this.categoryRepository.create(dto)
        return category
    }

    async updateCategory({ category, name }: UpdateCategoryDto): Promise<Category> {
        category.name = name
        category.save()
        return category
    }

    async deleteCategory({ category }: DeleteCategoryDto): Promise<Category> {
        await category.destroy()
        return category
    }

}