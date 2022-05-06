import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateCategoriesByLayoutDto } from 'src/categories/dto/category-layout.dto'
import { Category } from 'src/categories/models/categories.model'
import { TextChannel } from 'src/text-channels/models/text-channels.model'


@Injectable()
export class LayoutsService {

    constructor(
        @InjectModel(Category) private categoryRepository: typeof Category,
        @InjectModel(TextChannel) private textChannelRepository: typeof TextChannel,
    ) {}

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