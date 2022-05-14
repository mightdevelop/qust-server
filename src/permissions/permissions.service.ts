import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CategoriesService } from 'src/categories/categories.service'
import { Category } from 'src/categories/models/categories.model'
import { GroupsService } from 'src/groups/groups.service'
import { Group } from 'src/groups/models/groups.model'
import { Role } from 'src/roles/models/roles.model'
import { RolesService } from 'src/roles/roles.service'
import { TextChannelsService } from 'src/text-channels/text-channels.service'
import { PermissionsByRolesInGroupDto } from './dto/roles-group-permissions.dto'
import { PermissionsByRolesInTextChannelDto } from './dto/roles-text-channel-permissions.dto'
import { UserPermissionsInCategoryDto } from './dto/user-category-permissions.dto'
import { UserPermissionsInGroupDto } from './dto/user-group-permissions.dto'
import { UserPermissionsInTextChannelDto } from './dto/user-text-channel-permissions.dto'
import { RolePermissions } from './models/role-permissions.model'
import { ForcedPermissionLevel, PermissionLevel } from './types/permissions/permission-level'
import { DefaultRolePermissions } from './types/permissions/default-permissions'
import { RolePermissionsEnum } from './types/permissions/role-permissions.enum'
import { TextChannelRolePermissions } from 'src/text-channels/models/text-channel-role-permissions.model'
import { RoleTextChannelPermissionsEnum } from './types/permissions/role-text-channel-permissions.enum'


@Injectable()
export class PermissionsService {

    constructor(
        @Inject(forwardRef(() => RolesService)) private rolesService: RolesService,
        @Inject(forwardRef(() => GroupsService)) private groupsService: GroupsService,
        @Inject(forwardRef(() => TextChannelsService)) private textChannelsService: TextChannelsService,
        @Inject(forwardRef(() => CategoriesService)) private categoriesService: CategoriesService,
        @InjectModel(RolePermissions)
            private roleGroupPermissionsRepository: typeof RolePermissions
    ) {}

    async createDefaultRolePermissions(roleId: string): Promise<RolePermissions> {
        const permissions: RolePermissions = await this.roleGroupPermissionsRepository.create({ roleId })
        return permissions
    }

    async restoreDefaultRolePermissions(roleId: string): Promise<RolePermissions> {
        const permissions: RolePermissions = await this.roleGroupPermissionsRepository.findByPk(roleId)
        await permissions.update(DefaultRolePermissions)
        return permissions
    }

    private async isUserOwner(userId: string, groupId: string) {
        const group: Group = await this.groupsService.getGroupById(groupId)
        return group.ownerId === userId
    }

    async doesUserHavePermissionsInGroup(dto: UserPermissionsInGroupDto): Promise<boolean> {
        const isOwner: boolean = await this.isUserOwner(dto.userId, dto.groupId)
        if (isOwner) return true
        const roles: Role[] = await this.rolesService.getUserRolesByGroupId(dto.userId, dto.groupId, true)
        if (!roles.length)
            throw new ForbiddenException({ message: 'You are not a group participant' })
        const userGroupPermissions =
            await this.getPermissionsByRolesArrayInGroup({ roles, groupId: dto.groupId })
        const isAllPermissionAllowed = !!dto.requiredPermissions
            .filter(p => !userGroupPermissions.notAllowed.includes(p)).length
        return isAllPermissionAllowed
    }

    private async getPermissionsByRolesArrayInGroup(
        dto: PermissionsByRolesInGroupDto
    ): Promise<{
        allowed: RolePermissionsEnum[],
        notAllowed: RolePermissionsEnum[]
    }> {
        const permissions: [RolePermissionsEnum, ForcedPermissionLevel][] =
            [].concat(...
            dto.roles.map(role => role.permissions)
                .map(permissionsRow => Object
                    .entries(RolePermissionsEnum)
                    .map(p => [ p[0], permissionsRow.getDataValue(p[0] as keyof RolePermissions) ])
                ))

        const allowed: [RolePermissionsEnum, ForcedPermissionLevel][] = [ ...new Set(permissions
            .filter(p => p[1] === ForcedPermissionLevel.ALOWED)) ]
        const notAllowed: [RolePermissionsEnum, ForcedPermissionLevel][] = [ ...new Set(permissions
            .filter(p => !allowed.map(p => p[0]).includes(p[0]))) ]

        return {
            allowed: allowed.map(p => p[0]),
            notAllowed: notAllowed.map(p => p[0])
        }
    }

    async doesUserHavePermissionsInTextChannel(dto: UserPermissionsInTextChannelDto): Promise<boolean> {
        const groupId: string = await this.textChannelsService.getGroupIdByTextChannelId(dto.channelId)
        if (await this.isUserOwner(dto.userId, groupId)) return true
        const roles: Role[] = await this.rolesService.getUserRolesByGroupId(dto.userId, groupId)
        if (!roles.length)
            throw new ForbiddenException({ message: 'You are not a group participant' })
        const userTextChannelPermissions =
            await this.getPermissionsByRolesArrayInTextChannel({ roles, channelId: dto.channelId })

        const isSomePermissionNotAllowed = !!dto.requiredPermissions
            .filter(p => userTextChannelPermissions.notAllowed.includes(p)).length
        if (isSomePermissionNotAllowed) return false

        const notSpecifiedPermissions = dto.requiredPermissions
            .filter(p => userTextChannelPermissions.notSpecified.includes(p))
        if (!notSpecifiedPermissions.length) return true

        const userGroupPermissions =
            await this.getPermissionsByRolesArrayInGroup({ roles, groupId })
        const groupPermsNotAllowed =
            userGroupPermissions.notAllowed as unknown as RoleTextChannelPermissionsEnum[]
        const isAllPermissionAllowed = !!notSpecifiedPermissions
            .filter(p => !groupPermsNotAllowed.includes(p)).length

        return isAllPermissionAllowed
    }

    private async getPermissionsByRolesArrayInTextChannel(
        dto: PermissionsByRolesInTextChannelDto
    ): Promise<{
        allowed: RoleTextChannelPermissionsEnum[],
        notSpecified: RoleTextChannelPermissionsEnum[]
        notAllowed: RoleTextChannelPermissionsEnum[]
    }> {
        const permissions: [RoleTextChannelPermissionsEnum, PermissionLevel][] =
            [].concat(...
            dto.roles.map(role => role.textChannelPermissions)
                .map(permissionsRow => Object
                    .entries(TextChannelRolePermissions)
                    .map(p => [ p[0], permissionsRow
                        .getDataValue(p[0] as keyof TextChannelRolePermissions) ])
                ))

        const allowed: [RoleTextChannelPermissionsEnum, PermissionLevel][] = [ ...new Set(permissions
            .filter(p => p[1] === PermissionLevel.ALOWED)) ]
        const notSpecified: [RoleTextChannelPermissionsEnum, PermissionLevel][] = [ ...new Set(permissions
            .filter(p => p[1] === PermissionLevel.NONE)
            .filter(p => !allowed.map(p => p[0]).includes(p[0]))) ]
        const notAllowed: [RoleTextChannelPermissionsEnum, PermissionLevel][] = [ ...new Set(permissions
            .filter(p => p[1] === PermissionLevel.NOT_ALOWED)
            .filter(p => !allowed.map(p => p[0]).includes(p[0]))
            .filter(p => !notSpecified.map(p => p[0]).includes(p[0]))) ]

        return {
            allowed: allowed.map(p => p[0]),
            notSpecified: notSpecified.map(p => p[0]),
            notAllowed: notAllowed.map(p => p[0])
        }
    }

    async doesUserCanManageCategory(dto: UserPermissionsInCategoryDto): Promise<boolean> {
        const category: Category = await this.categoriesService.getCategoryById(dto.categoryId)
        if (!category)
            throw new NotFoundException({ message: 'Category not found' })
        if (await this.isUserOwner(dto.userId, category.groupId)) return true
        const roles: Role[] = await this.rolesService.getUserRolesByGroupId(dto.userId, category.groupId)
        const manageCategoryPermissions = roles.map(role => role.categoryPermissions.manageCategory)
        if (manageCategoryPermissions.some(p => p === PermissionLevel.ALOWED))
            return true
        if (manageCategoryPermissions.every(p => p === PermissionLevel.NOT_ALOWED))
            return false
        const userGroupPermissions =
            await this.getPermissionsByRolesArrayInGroup({ roles, groupId: category.groupId })
        const groupPermsAllowed: RolePermissionsEnum[] = userGroupPermissions.allowed
        return groupPermsAllowed.includes(RolePermissionsEnum.manageCategoriesAndChannels)
    }

}