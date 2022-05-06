import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RolePermissions } from './models/role-permissions.model'
import { RolesService } from './roles.service'
import { DefaultRolePermissions } from './types/permissions/default-permissions'


@Injectable()
export class PermissionsService {

    constructor(
        private rolesService: RolesService,
        @InjectModel(RolePermissions) private permissionsRepository: typeof RolePermissions,
    ) {}

    async createDefaultRolePermissions(roleId: number): Promise<RolePermissions> {
        const permissions: RolePermissions = await this.permissionsRepository.create({ roleId })
        return permissions
    }

    async restoreDefaultRolePermissions(roleId: number): Promise<RolePermissions> {
        const permissions: RolePermissions = await this.permissionsRepository.findByPk(roleId)
        await permissions.update(DefaultRolePermissions)
        return permissions
    }

}