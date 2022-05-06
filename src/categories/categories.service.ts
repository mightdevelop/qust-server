import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { TextChannel } from 'src/text-channels/models/text-channels.model'
import { CreateCategoriesByLayoutDto } from './dto/category-layout.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './models/categories.model'


@Injectable()
export class CategoriesService {

    constructor(
        @InjectModel(Category) private categoryRepository: typeof Category,
        @InjectModel(TextChannel) private textChannelRepository: typeof TextChannel,
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

    async createCategoriesAndTextChannelsByLayout(dto: CreateCategoriesByLayoutDto): Promise<void> {
        const categories: Category[] =
            await this.categoryRepository.bulkCreate(dto.categoryLayouts.map(categoryLayout => {
                return {
                    name: categoryLayout.name,
                    groupId: dto.groupId
                }
            }), { validate: true })
        await this.textChannelRepository.bulkCreate([].concat(
            ...dto.categoryLayouts.map((categoryLayout, categoryIndex) => {
                return categoryLayout.channels.map(channelLayout => {
                    return {
                        name: channelLayout.name,
                        categoryId: categories[categoryIndex].id
                    }
                })
            })
        ), { validate: true })
        return
    }

}