import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { RequiredPermissions } from 'src/permissions/decorators/required-permissions.decorator'
import { GroupPermissionsGuard } from 'src/permissions/guards/group-permissions.guard'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { Role } from 'src/roles/models/roles.model'
import { RolesService } from 'src/roles/roles.service'
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

    @Get('/:groupId/users')
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async getUsersByGroupId(
        @Param('groupId') groupId: string
    ): Promise<User[]> {
        const users: User[] = await this.usersService.getUsersByGroupId(groupId)
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
    @RequiredPermissions([ RolePermissionsEnum.manageRoles ])
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
    @RequiredPermissions([ RolePermissionsEnum.manageRoles ])
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

}