import { Body, Controller, Delete, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { RequiredGroupPermissions } from 'src/permissions/decorators/required-group-permissions.decorator'
import { GroupPermissionsGuard } from 'src/permissions/guards/group-permissions.guard'
import { TextChannelPermissionsGuard } from 'src/permissions/guards/text-channel-permissions.guard'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { CreateRoleDto } from './dto/create-role.dto'
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
        @Body() dto: CreateRoleDto,
    ): Promise<Role> {
        const role: Role = await this.rolesService.createRole(dto)
        return role
    }

    @Put('/:roleId')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(JwtAuthGuard, TextChannelPermissionsGuard)
    async updateRole(
        @Param('roleId') roleId: string,
        @Body() dto: {
            name?: string
            color?: string
        },
    ): Promise<Role> {
        const role: Role = await this.rolesService.getRoleById(roleId)
        if (!role)
            throw new NotFoundException({ message: 'Role not found' })
        const updatedRole: Role = await this.rolesService.updateRole({ role, ...dto })
        return updatedRole
    }

    @Delete('/:roleId')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(JwtAuthGuard, TextChannelPermissionsGuard)
    async deleteRole(
        @Param('roleId') roleId: string,
    ): Promise<Role> {
        const role: Role = await this.rolesService.getRoleById(roleId)
        if (!role)
            throw new NotFoundException({ message: 'Role not found' })
        await this.rolesService.updateRole({ role })
        return role
    }

}