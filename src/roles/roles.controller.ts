import { Body, Controller, Delete, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { RequiredGroupPermissions } from 'src/permissions/decorators/required-group-permissions.decorator'
import { GroupPermissionsGuard } from 'src/permissions/guards/group-permissions.guard'
import { TextChannelPermissionsGuard } from 'src/permissions/guards/text-channel-permissions.guard'
import { RolePermissionsListClass } from 'src/permissions/types/permissions/role-permissions-list.class'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { Role } from './models/roles.model'
import { RolesService } from './roles.service'


@Controller('/roles')
export class RolesController {

    constructor(
        private rolesService: RolesService
    ) {}

    @Post('/')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async createRole(
        @CurrentUser() user: UserFromRequest,
        @Body() dto: { name: string, color?: string, groupId: string },
    ): Promise<Role> {
        const role: Role = await this.rolesService.createRole({ ...dto, userId: user.id })
        return role
    }

    @Put('/:roleId')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(JwtAuthGuard, TextChannelPermissionsGuard)
    async updateRole(
        @CurrentUser() user: UserFromRequest,
        @Param('roleId') roleId: string,
        @Body() dto: {
            name?: string
            color?: string
            permissions?: RolePermissionsListClass
        },
    ): Promise<Role> {
        const role: Role = await this.rolesService.getRoleById(roleId)
        if (!role)
            throw new NotFoundException({ message: 'Role not found' })
        const updatedRole: Role = await this.rolesService.updateRole({ role, ...dto, userId: user.id })
        return updatedRole
    }

    @Delete('/:roleId')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(JwtAuthGuard, TextChannelPermissionsGuard)
    async deleteRole(
        @CurrentUser() user: UserFromRequest,
        @Param('roleId') roleId: string,
    ): Promise<Role> {
        const role: Role = await this.rolesService.getRoleById(roleId)
        if (!role)
            throw new NotFoundException({ message: 'Role not found' })
        await this.rolesService.deleteRole({ role, userId: user.id })
        return role
    }

}