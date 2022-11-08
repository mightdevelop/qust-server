import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { RequiredGroupPermissions } from 'src/permissions/decorators/required-group-permissions.decorator'
import { GroupPermissionsGuard } from 'src/permissions/guards/group-permissions.guard'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { Role } from 'src/roles/models/roles.model'
import { RolesService } from 'src/roles/roles.service'
import { UserModelInterceptor } from 'src/users/interceptors/users-model.interceptor'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import { CreateGroupBody } from './dto/create-group.body'
import { GroupIdDto } from './dto/group-id.dto'
import { GroupsService } from './groups.service'
import { GroupModelInterceptor } from './interceptors/groups-model.interceptor'
import { Group } from './models/groups.model'
import { PartialOffsetDto } from 'src/users/dto/partial-offset.dto'
import { Category } from 'src/categories/models/categories.model'
import { CategoriesService } from 'src/categories/categories.service'
import { UserIdAndRoleIdDto } from './dto/user-id-and-role-id-and-group-id.dto'
import { UserIdAndGroupIdDto } from 'src/permissions/dto/user-id-and-group-id.dto'


@ApiTags('groups')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('/groups')
export class GroupsController {

    constructor(
        private groupsService: GroupsService,
        private categoriesService: CategoriesService,
        private usersService: UsersService,
        private rolesService: RolesService,
    ) {}

    @Get('/:groupId')
    @UseGuards(GroupPermissionsGuard)
    @UseInterceptors(GroupModelInterceptor)
    async getGroupById(
        @Param() { groupId }: GroupIdDto
    ): Promise<Group> {
        const group: Group = await this.groupsService.getGroupById(groupId)
        return group
    }

    @Get('/:groupId/users')
    @UseGuards(GroupPermissionsGuard)
    @UseInterceptors(UserModelInterceptor)
    async getUsersByGroupId(
        @Param() { groupId }: GroupIdDto,
        @Query() { offset }: PartialOffsetDto
    ): Promise<User[]> {
        const users: User[] = await this.usersService.getUsersByGroupId(
            groupId, 30, offset ? Number(offset) : undefined
        )
        return users
    }

    @Get('/:groupId/users/:userId/roles')
    @UseGuards(GroupPermissionsGuard)
    async getUserRolesByGroupId(
        @Param() { userId, groupId }: UserIdAndGroupIdDto,
    ): Promise<Role[]> {
        const roles: Role[] = await this.rolesService.getUserRolesByGroupId(userId, groupId)
        if (!roles)
            throw new NotFoundException({ message: 'Roles not found' })
        return roles
    }

    @Get('/:groupId/categories')
    @UseGuards(GroupPermissionsGuard)
    async getCategoriesByGroupId(
        @Param() { groupId }: GroupIdDto,
        @CurrentUser() user: UserFromRequest,
    ): Promise<Category[]> {
        const categories: Category[] = await this.categoriesService.getCategoriesByGroupId(
            user.id, groupId
        )
        return categories
    }

    @Post('/:groupId/users/:userId/roles/:roleId')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(GroupPermissionsGuard)
    async addRoleToUser(
        @Param() { userId, roleId }: UserIdAndRoleIdDto,
    ): Promise<Role> {
        const role: Role = await this.rolesService.getRoleById(roleId)
        if (!role)
            throw new NotFoundException({ message: 'Role not found' })
        await this.rolesService.addRoleToUser({ roleId, userId })
        return role
    }

    @Delete('/:groupId/users/:userId/roles/:roleId')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(GroupPermissionsGuard)
    async removeRoleFromUser(
        @Param() { userId, roleId }: UserIdAndRoleIdDto,
    ): Promise<Role> {
        const role: Role = await this.rolesService.getRoleById(roleId)
        if (!role)
            throw new NotFoundException({ message: 'Role not found' })
        await this.rolesService.removeRoleFromUser({ roleId, userId })
        return role
    }

    @Post('/')
    @UseInterceptors(GroupModelInterceptor)
    async createGroup(
        @Body() body: CreateGroupBody,
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
    @UseInterceptors(GroupModelInterceptor)
    async deleteGroup(
        @CurrentUser() user: UserFromRequest,
        @Param() { groupId }: GroupIdDto,
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