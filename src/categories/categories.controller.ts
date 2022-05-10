import { Body, Controller, Delete, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { RequiredPermissions } from 'src/permissions/decorators/required-permissions.decorator'
import { CategoryPermissionsGuard } from 'src/permissions/guards/category-permissions.guard'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Category } from './models/categories.model'


@Controller('/categories')
export class CategoriesController {

    constructor(
        private categoriesService: CategoriesService,
    ) {}

    @Post('/')
    @UseGuards(JwtAuthGuard, CategoryPermissionsGuard)
    async createCategory(
        @Body() dto: CreateCategoryDto
    ): Promise<Category> {
        const category: Category = await this.categoriesService.createCategory(dto)
        return category
    }

    @Put('/:categoryId')
    @UseGuards(JwtAuthGuard, CategoryPermissionsGuard)
    async updateCategory(
        @Param('categoryId') categoryId: string,
        @Body() { name }: { name: string }
    ): Promise<Category> {
        const category: Category = await this.categoriesService.getCategoryById(categoryId)
        if (!category)
            throw new NotFoundException({ message: 'Category not found' })
        const updatedCategory: Category =
            await this.categoriesService.updateCategory({ name, category })
        return updatedCategory
    }

    @Delete('/:categoryId')
    @RequiredPermissions([ RolePermissionsEnum.manageCategoriesAndChannels ])
    @UseGuards(JwtAuthGuard, CategoryPermissionsGuard)
    async deleteCategory(
        @Param('categoryId') categoryId: string
    ): Promise<Category> {
        const category: Category = await this.categoriesService.getCategoryById(categoryId)
        if (!category)
            throw new NotFoundException({ message: 'Category not found' })
        const updatedCategory: Category =
            await this.categoriesService.deleteCategory({ category })
        return updatedCategory
    }

}