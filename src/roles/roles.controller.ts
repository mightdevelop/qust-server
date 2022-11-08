import { Body, Controller, Delete, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { RequiredGroupPermissions } from 'src/permissions/decorators/required-group-permissions.decorator'
import { GroupPermissionsGuard } from 'src/permissions/guards/group-permissions.guard'
import { TextChannelPermissionsGuard } from 'src/permissions/guards/text-channel-permissions.guard'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { CreateRoleBody } from './dto/create-role.body'
import { RoleIdDto } from './dto/role-id.dto'
import { UpdateRoleBody } from './dto/update-role.body'
import { Role } from './models/roles.model'
import { RolesService } from './roles.service'


@ApiTags('roles')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('/roles')
export class RolesController {

    constructor(
        private rolesService: RolesService
    ) {}

    @Post('/')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(GroupPermissionsGuard)
    async createRole(
        @CurrentUser() user: UserFromRequest,
        @Body() dto: CreateRoleBody,
    ): Promise<Role> {
        const role: Role = await this.rolesService.createRole({ ...dto, userId: user.id })
        return role
    }

    @Put('/:roleId')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(TextChannelPermissionsGuard)
    async updateRole(
        @CurrentUser() user: UserFromRequest,
        @Param() { roleId }: RoleIdDto,
        @Body() dto: UpdateRoleBody,
    ): Promise<Role> {
        const role: Role = await this.rolesService.getRoleById(roleId)
        if (!role)
            throw new NotFoundException({ message: 'Role not found' })
        const updatedRole: Role = await this.rolesService.updateRole({ role, ...dto, userId: user.id })
        return updatedRole
    }

    @Delete('/:roleId')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(TextChannelPermissionsGuard)
    async deleteRole(
        @CurrentUser() user: UserFromRequest,
        @Param() { roleId }: RoleIdDto,
    ): Promise<Role> {
        const role: Role = await this.rolesService.getRoleById(roleId)
        if (!role)
            throw new NotFoundException({ message: 'Role not found' })
        await this.rolesService.deleteRole({ role, userId: user.id })
        return role
    }

}