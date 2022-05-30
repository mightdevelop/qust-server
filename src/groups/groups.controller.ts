import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { Category } from 'src/categories/models/categories.model'
import { GroupBlacklist } from 'src/group-blacklists/models/group-blacklists.model'
import { RequiredGroupPermissions } from 'src/permissions/decorators/required-group-permissions.decorator'
import { GroupPermissionsGuard } from 'src/permissions/guards/group-permissions.guard'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { Role } from 'src/roles/models/roles.model'
import { RolesService } from 'src/roles/roles.service'
import { TextChannel } from 'src/text-channels/models/text-channels.model'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import { GroupsService } from './groups.service'
import { Group } from './models/groups.model'
import { GroupLayoutName } from './types/group-layout-names.enum'


@Controller('/groups')
export class GroupsController {

    constructor(
        private groupsService: GroupsService,
        private usersService: UsersService,
        private rolesService: RolesService,
    ) {}

    @Get('/:groupId')
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async getGroupById(
        @Param('groupId') groupId: string,
        @Body() { full }: { full?: boolean }
    ): Promise<Group> {
        const group: Group = await this.groupsService.getGroupById(groupId,
            full ? [
                { model: Category, include: [ TextChannel ] },
                { model: GroupBlacklist, include: [ User ] },
                { all: true }
            ] : undefined
        )
        return group
    }

    @Get('/:groupId/users')
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async getUsersByGroupId(
        @Param('groupId') groupId: string,
        @Query('offset') offset: number
    ): Promise<User[]> {
        const users: User[] = await this.usersService.getUsersByGroupId(groupId, 30, offset)
        return users
    }

    @Get('/:groupId/users/:userId/roles')
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async getUserRolesByGroupId(
        @Param('groupId') groupId: string,
        @Param('userId') userId: string,
    ): Promise<Role[]> {
        const roles: Role[] = await this.rolesService.getUserRolesByGroupId(userId, groupId)
        if (!roles)
            throw new NotFoundException({ message: 'Roles not found' })
        return roles
    }

    @Post('/:groupId/users/:userId/roles/:roleId')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async addRoleToUser(
        @Param('userId') userId: string,
        @Param('roleId') roleId: string,
    ): Promise<Role> {
        const role: Role = await this.rolesService.getRoleById(roleId)
        if (!role)
            throw new NotFoundException({ message: 'Role not found' })
        await this.rolesService.addRoleToUser({ roleId, userId })
        return role
    }

    @Delete('/:groupId/users/:userId/roles/:roleId')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async removeRoleFromUser(
        @Param('userId') userId: string,
        @Param('roleId') roleId: string,
    ): Promise<Role> {
        const role: Role = await this.rolesService.getRoleById(roleId)
        if (!role)
            throw new NotFoundException({ message: 'Role not found' })
        await this.rolesService.removeRoleFromUser({ roleId, userId })
        return role
    }

    @Post('/')
    @UseGuards(JwtAuthGuard)
    async createGroup(
        @Body() body: { name: string, layout?: GroupLayoutName },
        @CurrentUser() user: UserFromRequest
    ): Promise<Group> {
        const group: Group = await this.groupsService.createGroup({
            ...body,
            ownerId: user.id,
        })
        await this.groupsService.addUserToGroup({ userId: user.id, groupId: group.id })
        return group
    }

    @Delete('/:groupId')
    @UseGuards(JwtAuthGuard)
    async deleteGroup(
        @CurrentUser() user: UserFromRequest,
        @Param('groupId') groupId: string,
    ): Promise<Group> {
        const group: Group = await this.groupsService.getGroupById(groupId)
        if (!group)
            throw new NotFoundException({ message: 'Group not found' })
        if (group.ownerId !== user.id)
            throw new ForbiddenException({ message: 'You have no permissions' })
        await this.groupsService.deleteGroup({ group })
        return group
    }

}