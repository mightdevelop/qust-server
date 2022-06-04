import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/sequelize'
import { UsersService } from 'src/users/users.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { DeleteCategoryDto } from './dto/delete-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { InternalCategoriesCudEvent } from './events/internal-categories.CUD.event'
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
        this.eventEmitter.emit(
            'internal-categories.created',
            new InternalCategoriesCudEvent({
                category,
                userIdWhoTriggered: dto.userId,
                action: 'create' })
        )
        return category
    }

    async updateCategory({ category, name, userId }: UpdateCategoryDto): Promise<Category> {
        category.name = name
        await category.save()
        this.eventEmitter.emit(
            'internal-categories.updated',
            new InternalCategoriesCudEvent({
                category,
                userIdWhoTriggered: userId,
                action: 'update' })
        )
        return category
    }

    async deleteCategory(dto: DeleteCategoryDto): Promise<Category> {
        await dto.category.destroy()
        this.eventEmitter.emit(
            'internal-categories.deleted',
            new InternalCategoriesCudEvent({
                category: dto.category,
                userIdWhoTriggered:
                dto.userId,
                action: 'delete'
            })
        )
        return dto.category
    }

}