import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/sequelize'
import { Includeable } from 'sequelize/types'
import { PermissionsService } from 'src/permissions/permissions.service'
import { CategoryIdDto } from './dto/category-id.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { DeleteCategoryDto } from './dto/delete-category.dto'
import { UpdateCategoryByIdDto } from './dto/update-category-by-id.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { InternalCategoriesCudEvent } from './events/internal-categories.CUD.event'
import { Category } from './models/categories.model'


@Injectable()
export class CategoriesService {

    constructor(
        private eventEmitter: EventEmitter2,
        private permissionsService: PermissionsService,
        @InjectModel(Category) private categoryRepository: typeof Category,
    ) {}

    async getCategoryById(categoryId: string): Promise<Category> {
        const category: Category = await this.categoryRepository.findByPk(categoryId)
        return category
    }

    async getCategoriesByGroupId(
        userId: string,
        groupId: string,
        include?: Includeable | Includeable[]
    ): Promise<Category[]> {
        if (!await this.permissionsService.isUserGroupParticipant({ userId, groupId })) return []
        const categories: Category[] = await this.categoryRepository.findAll({
            where: { groupId }, include
        })
        return categories
    }

    async createCategory(dto: CreateCategoryDto, userId: string): Promise<Category> {
        const category: Category = await this.categoryRepository.create(dto)
        this.eventEmitter.emit(
            'internal-categories.created',
            new InternalCategoriesCudEvent({
                category,
                userIdWhoTriggered: userId,
                action: 'create' })
        )
        return category
    }

    async updateCategoryById(
        { categoryId, name }: UpdateCategoryByIdDto,
        userId: string
    ): Promise<Category> {
        const category: Category = await this.getCategoryById(categoryId)
        if (!category)
            throw new NotFoundException({ message: 'Category not found' })
        await this.updateCategory({ category, name }, userId)
        return category
    }

    async updateCategory({ category, name }: UpdateCategoryDto, userId: string): Promise<Category> {
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

    async deleteCategoryById({ categoryId }: CategoryIdDto, userId: string): Promise<Category> {
        const category: Category = await this.getCategoryById(categoryId)
        if (!category)
            throw new NotFoundException({ message: 'Category not found' })
        await this.deleteCategory({ category }, userId)
        return category
    }

    async deleteCategory(dto: DeleteCategoryDto, userId: string): Promise<Category> {
        await dto.category.destroy()
        this.eventEmitter.emit(
            'internal-categories.deleted',
            new InternalCategoriesCudEvent({
                category: dto.category,
                userIdWhoTriggered: userId,
                action: 'delete'
            })
        )
        return dto.category
    }

}