import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/sequelize'
import { UsersService } from 'src/users/users.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { DeleteCategoryDto } from './dto/delete-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { InternalCategoriesCreatedEvent } from './events/internal-categories-created.event'
import { InternalCategoriesDeletedEvent } from './events/internal-categories-deleted.event'
import { InternalCategoriesUpdatedEvent } from './events/internal-categories-updated.event'
import { Category } from './models/categories.model'


@Injectable()
export class CategoriesService {

    constructor(
        private eventEmitter: EventEmitter2,
        private usersService: UsersService,
        @InjectModel(Category) private categoryRepository: typeof Category,
    ) {}

    async getCategoryById(categoryId): Promise<Category> {
        const category: Category = await this.categoryRepository.findByPk(categoryId)
        return category
    }

    async createCategory(dto: CreateCategoryDto): Promise<Category> {
        const category: Category = await this.categoryRepository.create(dto)
        const usersIds: string[] = (await this.usersService.getUsersByGroupId(category.id))
            .map(user => user.id)
        this.eventEmitter.emit(
            'internal-categories.created',
            new InternalCategoriesCreatedEvent({ category, usersIds })
        )
        return category
    }

    async updateCategory({ category, name }: UpdateCategoryDto): Promise<Category> {
        category.name = name
        await category.save()
        const usersIds: string[] = (await this.usersService.getUsersByGroupId(category.id))
            .map(user => user.id)
        this.eventEmitter.emit(
            'internal-categories.updated',
            new InternalCategoriesUpdatedEvent({ category, usersIds })
        )
        return category
    }

    async deleteCategory({ category }: DeleteCategoryDto): Promise<Category> {
        await category.destroy()
        const usersIds: string[] = (await this.usersService.getUsersByGroupId(category.id))
            .map(user => user.id)
        this.eventEmitter.emit(
            'internal-categories.deleted',
            new InternalCategoriesDeletedEvent({ categoryId: category.id, usersIds })
        )
        return category
    }

}