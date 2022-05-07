import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { GroupsService } from 'src/groups/groups.service'
import { Group } from 'src/groups/models/groups.model'
import { UserPermissionsInGroupDto } from './dto/user-group-permissions.dto'
import { UserPermissionsInTextChannelDto } from './dto/user-text-channel-permissions.dto'
import { RolePermissions } from './models/role-permissions.model'
import { Role } from './models/roles.model'
import { RolesService } from './roles.service'
import { ForcedPermissionLevel } from './types/permission-level'
import { DefaultRolePermissions } from './types/permissions/default-permissions'
import { RolePermissionsEnum } from './types/permissions/role-permissions.enum'


@Injectable()
export class PermissionsService {

    constructor(
        private rolesService: RolesService,
        private groupsService: GroupsService,
        @InjectModel(RolePermissions) private permissionsRepository: typeof RolePermissions,
    ) {}

    async doesUserHavePermissionsInGroup(dto: UserPermissionsInGroupDto): Promise<boolean> {
        const group: Group = await this.groupsService.getGroupById(dto.groupId)
        if (group.ownerId === dto.userId) return true
        const roles: Role[] = await this.rolesService.getUserRolesByGroupId(dto.userId, dto.groupId, true)
        const userPermissions: RolePermissionsEnum[] = [ ...new Set(
            [].concat(...
            roles
                .map(role => role.permissions)
                .map(permissionsColumn => Object.entries(permissionsColumn)
                    .map(permission => permission[1])
                    .filter(permission => permission === ForcedPermissionLevel.ALOWED)
                )
            )) ]
        console.log(userPermissions)
        const doesHavePermissions = !!dto.permissions.filter(p => userPermissions.includes(p)).length
        return doesHavePermissions
    }

    async doesUserHavePermissionsInTextChannel(dto: UserPermissionsInTextChannelDto): Promise<boolean> {
        await this.permissionsRepository.findAll({ where: {

        } })
        return
    }

    async createDefaultRolePermissions(roleId: string): Promise<RolePermissions> {
        const permissions: RolePermissions = await this.permissionsRepository.create({ roleId })
        return permissions
    }

    async restoreDefaultRolePermissions(roleId: string): Promise<RolePermissions> {
        const permissions: RolePermissions = await this.permissionsRepository.findByPk(roleId)
        await permissions.update(DefaultRolePermissions)
        return permissions
    }

}