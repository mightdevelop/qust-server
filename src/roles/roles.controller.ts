import { Body, Controller, Delete, NotFoundException, Param, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { RequiredPermissions } from 'src/permissions/decorators/required-permissions.decorator'
import { TextChannelPermissionsGuard } from 'src/permissions/guards/text-channel-permissions.guard'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { Role } from './models/roles.model'
import { RolesService } from './roles.service'


@Controller('/roles')
export class RolesController {

    constructor(
        private rolesService: RolesService
    ) {}

    @Put('/:id')
    @RequiredPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(JwtAuthGuard, TextChannelPermissionsGuard)
    async updateRole(
        @Param('id') roleId: string,
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

    @Delete('/:id')
    @RequiredPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(JwtAuthGuard, TextChannelPermissionsGuard)
    async deleteRole(
        @Param('id') roleId: string,
    ): Promise<Role> {
        const role: Role = await this.rolesService.getRoleById(roleId)
        if (!role)
            throw new NotFoundException({ message: 'Role not found' })
        await this.rolesService.updateRole({ role })
        return role
    }

}