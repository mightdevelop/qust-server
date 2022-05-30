import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
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
import { TextChannel } from 'src/text-channels/models/text-channels.model'
import { CategoryRolePermissions } from 'src/categories/models/category-role-permissions.model'
import { UserIdAndGroupIdDto } from './dto/user-id-and-group-id.dto'


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
        permissions.setAttributes(DefaultRolePermissions)
        await permissions.save()
        return permissions
    }

    async isUserGroupParticipant(dto: UserIdAndGroupIdDto): Promise<boolean> {
        return await this.groupsService.isUserGroupParticipant(dto)
    }

    async doesUserHavePermissionsInGroup(dto: UserPermissionsInGroupDto): Promise<boolean> {
        const group: Group = await this.groupsService.getGroupById(dto.groupId)
        if (!group)
            throw new NotFoundException({ message: 'Group not found' })
        if (group.ownerId === dto.userId) return true
        const roles: Role[] = await this.rolesService.getUserRolesByGroupId(
            dto.userId, dto.groupId, [ RolePermissions ]
        )
        if (!roles.length)
            return false
        if (!dto.requiredPermissions.length)
            return true
        const userGroupPermissions =
            await this.getPermissionsByRolesArrayInGroup({ roles, groupId: dto.groupId })
        const isAllPermissionAllowed = !!dto.requiredPermissions
            .filter(p => !userGroupPermissions.notAllowed.includes(p)).length
        return isAllPermissionAllowed
    }

    private async getPermissionsByRolesArrayInGroup(
        dto: PermissionsByRolesInGroupDto
    ): Promise<{
        allowed: RolePermissionsEnum[]
        notAllowed: RolePermissionsEnum[]
    }> {
        const permissions: [RolePermissionsEnum, ForcedPermissionLevel][] =
            [].concat(...
            dto.roles
                .map(role => role.permissions)
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
        const group: Group = await this.groupsService.getGroupById(groupId)
        if (!group)
            throw new NotFoundException({ message: 'Group not found' })
        if (group.ownerId === dto.userId) return true
        const roles: Role[] = await this.rolesService.getUserRolesByGroupId(
            dto.userId, groupId, [ RolePermissions, TextChannelRolePermissions ]
        )
        if (!roles.length)
            return false
        const userTextChannelPermissions =
            await this.getPermissionsByRolesArrayInTextChannel({ roles, channelId: dto.channelId })
        dto.requiredPermissions.push(RoleTextChannelPermissionsEnum.viewTextChannels)
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
        { roles, channelId }: PermissionsByRolesInTextChannelDto
    ): Promise<{
        allowed: RoleTextChannelPermissionsEnum[]
        notSpecified: RoleTextChannelPermissionsEnum[]
        notAllowed: RoleTextChannelPermissionsEnum[]
    }> {
        const permissions: [RoleTextChannelPermissionsEnum, PermissionLevel][] =
            [].concat(...
            roles
                .map(role => role.textChannelPermissions.find(row => row.channelId === channelId))
                .filter(permissionsRow => permissionsRow)
                .map(permissionsRow => Object
                    .entries(TextChannelRolePermissions)
                    .map(p => [ p[0], permissionsRow
                        .getDataValue(p[0] as keyof TextChannelRolePermissions) ])))

        if (permissions.length === 0) {
            return {
                allowed: [],
                notSpecified: [],
                notAllowed: Object.keys(RoleTextChannelPermissionsEnum) as RoleTextChannelPermissionsEnum[]
            }
        }

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

    async doesUserCanManageCategory(
        { categoryId, userId }: UserPermissionsInCategoryDto
    ): Promise<boolean> {
        const category: Category = await this.categoriesService.getCategoryById(categoryId)
        if (!category)
            throw new NotFoundException({ message: 'Category not found' })
        const group: Group = await this.groupsService.getGroupById(category.groupId)
        if (group.ownerId === userId) return true
        const roles: Role[] = await this.rolesService.getUserRolesByGroupId(
            userId, category.groupId, [ RolePermissions, CategoryRolePermissions ]
        )
        const manageCategoryPermissions: PermissionLevel[] =
            roles.map(role => role.categoryPermissions
                .find(row => row.categoryId === categoryId).manageCategory)

        if (manageCategoryPermissions.some(p => p === PermissionLevel.ALOWED))
            return true
        if (manageCategoryPermissions.every(p => p === PermissionLevel.NOT_ALOWED))
            return false
        const userGroupPermissions =
            await this.getPermissionsByRolesArrayInGroup({ roles, groupId: category.groupId })
        return userGroupPermissions.allowed.includes(RolePermissionsEnum.manageCategoriesAndChannels)
    }

    async getAllowedToViewTextChannelsIdsByUserId(userId: string): Promise<string[]> {
        const groupsIds: string[] = await this.groupsService.getGroupsIdsByUserId(userId)
        const allowedToViewTextChannelsIds: string[] = []
        for (const groupId of groupsIds) {
            const group: Group = await this.groupsService.getGroupById(groupId,
                { model: Category, include: [ TextChannel ] }
            )
            const channels: TextChannel[] = [].concat(...group.categories.map(category => category.channels))
            if (group.ownerId === userId) return channels.map(channel => channel.id)
            const roles: Role[] = await this.rolesService.getUserRolesByGroupId(
                userId, groupId, [ RolePermissions, TextChannelRolePermissions ]
            )
            const userGroupPermissions =
                await this.getPermissionsByRolesArrayInGroup({ roles, groupId })
            const allowedToViewTextChannelsIdsInGroup: string[] = []
            for (const channel of channels) {
                const viewChannelPermissions: PermissionLevel[] =
                    roles.map(role => role.textChannelPermissions
                        .find(row => row.channelId === channel.id)?.viewTextChannels)

                if (
                    viewChannelPermissions.every(p => p === PermissionLevel.NOT_ALOWED)
                    &&
                    userGroupPermissions.notAllowed.includes(RolePermissionsEnum.viewTextChannels)
                ) continue
                allowedToViewTextChannelsIdsInGroup.push(channel.id)
            }
            allowedToViewTextChannelsIds.push(...allowedToViewTextChannelsIdsInGroup)
        }
        return allowedToViewTextChannelsIds
    }

    async getIdsOfUsersThatCanViewTextChannel(
        channelId: string
    ): Promise<string[]> {
        const idsOfRolesThatCanViewTextChannel: string[] =
            await this.getIdsOfRolesThatCanViewTextChannel(channelId)
        const usersIds: string[] =
            await this.rolesService.getIdsOfUsersThatHaveAnyOfRoles(idsOfRolesThatCanViewTextChannel)
        return usersIds
    }

    private async getIdsOfRolesThatCanViewTextChannel(
        channelId: string
    ): Promise<string[]> {
        const channel: TextChannel = await this.textChannelsService.getTextChannelById(channelId)
        if (!channel)
            throw new NotFoundException({ message: 'Text channel not found' })
        const groupId: string = await this.textChannelsService.getGroupIdByTextChannelId(channelId)
        const roles: Role[] = await this.rolesService.getRolesByGroupId(
            groupId, [ RolePermissions, CategoryRolePermissions ]
        )
        const rolesThatCanViewTextChannel: Role[] =
            roles
                .filter(role => role.textChannelPermissions
                    .find(row => row.channelId === channelId)
                    .viewTextChannels === PermissionLevel.ALOWED)
        const rolesWithNotSpecifiedViewTextChannelPermission: Role[] =
            roles
                .filter(role => role.textChannelPermissions
                    .find(row => row.channelId === channelId)
                    .viewTextChannels === PermissionLevel.NOT_ALOWED)
        if (!rolesWithNotSpecifiedViewTextChannelPermission)
            return rolesThatCanViewTextChannel.map(role => role.id)
        return [
            ...rolesThatCanViewTextChannel
                .map(role => role.id),
            ...rolesWithNotSpecifiedViewTextChannelPermission
                .filter(role => role.permissions.viewTextChannels === ForcedPermissionLevel.ALOWED)
                .map(role => role.id)
        ]
    }

}