import { Body, Controller, Delete, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { RequiredGroupPermissions } from 'src/permissions/decorators/required-group-permissions.decorator'
import { CategoryPermissionsGuard } from 'src/permissions/guards/category-permissions.guard'
import { GroupPermissionsGuard } from 'src/permissions/guards/group-permissions.guard'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { CategoriesService } from './categories.service'
import { Category } from './models/categories.model'


@Controller('/categories')
export class CategoriesController {

    constructor(
        private categoriesService: CategoriesService,
    ) {}

    @Post('/')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageCategoriesAndChannels ])
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async createCategory(
        @CurrentUser() user: UserFromRequest,
        @Body() dto: { name: string, groupId: string },
    ): Promise<Category> {
        const category: Category = await this.categoriesService.createCategory({ ...dto, userId: user.id })
        return category
    }

    @Put('/:categoryId')
    @UseGuards(JwtAuthGuard, CategoryPermissionsGuard)
    async updateCategory(
        @Param('categoryId') categoryId: string,
        @Body() { name }: { name: string },
        @CurrentUser() user: UserFromRequest,
    ): Promise<Category> {
        const category: Category = await this.categoriesService.getCategoryById(categoryId)
        if (!category)
            throw new NotFoundException({ message: 'Category not found' })
        const updatedCategory: Category =
            await this.categoriesService.updateCategory({ name, category, userId: user.id })
        return updatedCategory
    }

    @Delete('/:categoryId')
    @UseGuards(JwtAuthGuard, CategoryPermissionsGuard)
    async deleteCategory(
        @Param('categoryId') categoryId: string,
        @CurrentUser() user: UserFromRequest,
    ): Promise<Category> {
        const category: Category = await this.categoriesService.getCategoryById(categoryId)
        if (!category)
            throw new NotFoundException({ message: 'Category not found' })
        const updatedCategory: Category =
            await this.categoriesService.deleteCategory({ category, userId: user.id })
        return updatedCategory
    }

}