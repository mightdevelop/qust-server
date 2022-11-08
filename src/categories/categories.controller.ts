import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { RequiredGroupPermissions } from 'src/permissions/decorators/required-group-permissions.decorator'
import { CategoryPermissionsGuard } from 'src/permissions/guards/category-permissions.guard'
import { GroupPermissionsGuard } from 'src/permissions/guards/group-permissions.guard'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { TextChannel } from 'src/text-channels/models/text-channels.model'
import { TextChannelsService } from 'src/text-channels/text-channels.service'
import { CategoriesService } from './categories.service'
import { CategoryIdDto } from './category-id.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { NameDto } from './dto/name.dto'
import { Category } from './models/categories.model'


@ApiTags('categories')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('/categories')
export class CategoriesController {

    constructor(
        private categoriesService: CategoriesService,
        private textChannelsService: TextChannelsService,
    ) {}

    @Get('/:categoryId/textChannels')
    @UseGuards(GroupPermissionsGuard)
    async getTextChannelsByCategoryId(
        @Param() { categoryId }: CategoryIdDto,
        @CurrentUser() user: UserFromRequest,
    ): Promise<TextChannel[]> {
        const category: Category = await this.categoriesService.getCategoryById(categoryId)
        const textChannels: TextChannel[] = await this.textChannelsService.getTextChannelsByCategoryId(
            user.id, category.groupId, categoryId
        )
        return textChannels
    }

    @Post('/')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageCategoriesAndChannels ])
    @UseGuards(GroupPermissionsGuard)
    async createCategory(
        @CurrentUser() user: UserFromRequest,
        @Body() dto: CreateCategoryDto,
    ): Promise<Category> {
        const category: Category = await this.categoriesService.createCategory(dto, user.id)
        return category
    }

    @Put('/:categoryId')
    @UseGuards(CategoryPermissionsGuard)
    async updateCategory(
        @Param() { categoryId }: CategoryIdDto,
        @Body() { name }: NameDto,
        @CurrentUser() user: UserFromRequest,
    ): Promise<Category> {
        const updatedCategory: Category =
            await this.categoriesService.updateCategoryById({ name, categoryId }, user.id)
        return updatedCategory
    }

    @Delete('/:categoryId')
    @UseGuards(CategoryPermissionsGuard)
    async deleteCategory(
        @Param() { categoryId }: CategoryIdDto,
        @CurrentUser() user: UserFromRequest,
    ): Promise<Category> {
        const deletedCategory: Category =
            await this.categoriesService.deleteCategoryById({ categoryId }, user.id)
        return deletedCategory
    }

}