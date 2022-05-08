import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateCategoriesAndRolesByLayoutsDto } from 'src/categories/dto/create-categories-and-roles-layout.dto'
import { Category } from 'src/categories/models/categories.model'
import { CategoryRolePermissions } from 'src/categories/models/category-role-permissions.model'
import { RolePermissions } from 'src/permissions/models/role-permissions.model'
import { Role } from 'src/roles/models/roles.model'
import { TextChannelRolePermissions } from 'src/text-channels/models/text-channel-role-permissions.model'
import { TextChannel } from 'src/text-channels/models/text-channels.model'


@Injectable()
export class LayoutsService {

    constructor(
        @InjectModel(Role) private roleRepository: typeof Role,
        @InjectModel(RolePermissions) private rolePermissionsRepository: typeof RolePermissions,
        @InjectModel(Category) private categoryRepository: typeof Category,
        @InjectModel(CategoryRolePermissions)
            private categoryPermissionsRepository: typeof CategoryRolePermissions,
        @InjectModel(TextChannel) private textChannelRepository: typeof TextChannel,
        @InjectModel(TextChannelRolePermissions)
            private channelPermissionsRepository: typeof TextChannelRolePermissions,
    ) {}

    async createCategoriesAndTextChannelsByLayout(
        { groupId, groupLayout }: CreateCategoriesAndRolesByLayoutsDto
    ): Promise<void> {
        const roles: Role[] =
            await this.roleRepository.bulkCreate(groupLayout.roleLayouts.map(roleLayout => {
                return {
                    name: roleLayout.name,
                    groupId
                }
            }))
        await this.rolePermissionsRepository.bulkCreate(groupLayout.roleLayouts.map(roleLayout => {
            return { roleId: roles.find(role => role.name === roleLayout.name).id }
        }), { validate: true })
        const categories: Category[] =
            await this.categoryRepository.bulkCreate(groupLayout.categoryLayouts.map(categoryLayout => {
                return {
                    name: categoryLayout.name,
                    groupId
                }
            }), { validate: true })
        await this.categoryPermissionsRepository.bulkCreate([].concat(
            ...groupLayout.categoryLayouts.map((categoryLayout, categoryIndex) => {
                return categoryLayout.permissionsOfRoles?.map(roleWithPermissions => {
                    return {
                        roleId: roles.find(role => role.name === roleWithPermissions.roleName).id,
                        categoryId: categories[categoryIndex].id,
                        ...roleWithPermissions.permissions
                    }
                })
            })
        ).filter(value => value), { validate: true })
        const channels: TextChannel[] =
            await this.textChannelRepository.bulkCreate([].concat(
                ...groupLayout.categoryLayouts.map((categoryLayout, categoryIndex) => {
                    return categoryLayout.channelLayouts.map(channelLayout => {
                        return {
                            name: channelLayout.name,
                            categoryId: categories[categoryIndex].id
                        }
                    })
                })
            ), { validate: true })
        await this.channelPermissionsRepository.bulkCreate([].concat(...[].concat(
            ...groupLayout.categoryLayouts.map(categoryLayout => {
                return categoryLayout.channelLayouts.map((channelLayout, channelIndex) => {
                    return channelLayout.permissionsOfRoles?.map(roleWithPermissions => {
                        return {
                            roleId: roles.find(role => role.name === roleWithPermissions.roleName).id,
                            channelId: channels[channelIndex].id,
                            ...roleWithPermissions.permissions
                        }
                    })
                })
            })
        ).filter(value => value)), { validate: true })
        return
    }

}