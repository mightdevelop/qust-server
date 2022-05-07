import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { RequestResponseUser } from 'src/auth/types/request-response'
import { RequiredPermissions } from 'src/roles/decorators/required-permissions.decorator'
import { CreateRoleDto } from 'src/roles/dto/create-role.dto'
import { GroupPermissionsGuard } from 'src/roles/guards/group-permissions.guard'
import { Role } from 'src/roles/models/roles.model'
import { RolesService } from 'src/roles/roles.service'
import { RolePermissionsEnum } from 'src/roles/types/permissions/role-permissions.enum'
import { GroupsService } from './groups.service'
import { Group } from './models/groups.model'
import { GroupLayoutName } from './types/group-layout-names.enum'


@Controller('/groups')
export class GroupsController {

    constructor(
        private groupsService: GroupsService,
        private rolesService: RolesService,
    ) {}

    @Post('/')
    @UseGuards(JwtAuthGuard)
    async createGroup(
        @Body() body: { name: string, layout?: GroupLayoutName },
        @CurrentUser() user: RequestResponseUser
    ): Promise<Group> {
        const group: Group = await this.groupsService.createGroup({
            ...body,
            ownerId: user.id,
        })
        return group
    }

    @Post('/:id/roles')
    @RequiredPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async createRole(
        @Param('id') groupId: string,
        @Body() dto: {
            name: string,
            color?: string
        },
    ): Promise<Role> {
        const role: Role = await this.rolesService.createRole({ groupId, ...dto })
        return role
    }

}