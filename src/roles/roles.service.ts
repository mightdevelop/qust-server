import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { RolePermissions } from 'src/permissions/models/role-permissions.model'
import { PermissionsService } from 'src/permissions/permissions.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { DeleteRoleDto } from './dto/delete-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RoleUser } from './models/role-user.model'
import { Role } from './models/roles.model'


@Injectable()
export class RolesService {

    constructor(
        @Inject(forwardRef(() => PermissionsService)) private permissionsService: PermissionsService,
        @InjectModel(Role) private roleRepository: typeof Role,
        @InjectModel(RoleUser) private roleUserRepository: typeof RoleUser,
    ) {}

    async getRoleById(roleId: string): Promise<Role> {
        const role: Role = await this.roleRepository.findByPk(roleId)
        return role
    }

    async getUserRolesByGroupId(
        userId: string,
        groupId: string,
        includePermissions?: boolean
    ): Promise<Role[]> {
        const groupRoles: Role[] =
            includePermissions
                ?
                await this.roleRepository.findAll({ where: { groupId }, include: RolePermissions })
                :
                await this.roleRepository.findAll({ where: { groupId } })
        const roleUserColumns: RoleUser[] = await this.roleUserRepository.findAll({ where: {
            [Op.or]: groupRoles.map(role => ({
                userId,
                roleId: role.id
            }))
        } })
        const userRoles: Role[] = await this.roleRepository.findAll({ where: {
            [Op.or]: roleUserColumns.map(role => ({ roleId: role.id })) }
        })
        if (!userRoles.find(r => r.name === 'everyone'))
            userRoles.push(await this.roleRepository.findOne({ where: { name: 'everyone' } }))
        return userRoles
    }

    async createRole(dto: CreateRoleDto): Promise<Role> {
        const role: Role = await this.roleRepository.create(dto)
        const permissions: RolePermissions =
            await this.permissionsService.createDefaultRolePermissions(role.id)
        await role.$set('permissions', permissions)
        return role
    }

    async updateRole({ role, color, name }: UpdateRoleDto): Promise<Role> {
        await role.update({ color, name })
        return role
    }

    async deleteRole({ role }: DeleteRoleDto): Promise<Role> {
        await role.destroy()
        return role
    }

}