import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Includeable, Op } from 'sequelize'
import { RolePermissions } from 'src/permissions/models/role-permissions.model'
import { PermissionsService } from 'src/permissions/permissions.service'
import { RoleIdAndUserIdDto } from './dto/roleid-and-userid.dto'
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

    async getRoleById(roleId: string, include?: Includeable | Includeable[]): Promise<Role> {
        const role: Role = await this.roleRepository.findByPk(roleId, { include })
        return role
    }

    async getRolesByGroupId(groupId: string, include?: Includeable | Includeable[]): Promise<Role[]> {
        const roles: Role[] = await this.roleRepository.findAll({ where: { groupId }, include })
        return roles
    }

    async getEveryoneRoleByGroupId(groupId: string): Promise<Role> {
        const everyoneRole: Role =
            await this.roleRepository.findOne({ where: { groupId, name: 'everyone' } })
        return everyoneRole
    }

    async getUserRolesByGroupId(
        userId: string,
        groupId: string,
        include?: Includeable | Includeable[]
    ): Promise<Role[]> {
        if (!await this.permissionsService.isUserGroupParticipant({ userId, groupId })) return []
        const groupRoles: Role[] = await this.roleRepository.findAll(
            { where: { groupId }, include }
        )
        const roleUserRows: RoleUser[] = await this.roleUserRepository.findAll({ where: {
            [Op.or]: groupRoles.map(role => ({
                userId,
                roleId: role.id
            }))
        } })
        const userRoles: Role[] = await this.roleRepository.findAll({ where: {
            [Op.or]: roleUserRows.map(row => ({ id: row.roleId })) }, include
        })
        if (!userRoles.find(r => r.name === 'everyone')) {
            const everyone: Role = await this.roleRepository.findOne(
                { where: { name: 'everyone' }, include }
            )
            userRoles.push(everyone)
        }
        return userRoles
    }

    async getIdsOfUsersThatHaveAnyOfRoles(rolesIds: string[]): Promise<string[]> {
        const usersIds: string[] =
            (await this.roleUserRepository.findAll({ where: { [Op.or]: { roleId: rolesIds } } }))
                .map(row => row.userId)
        return usersIds
    }

    async createRole(dto: CreateRoleDto): Promise<Role> {
        const role: Role = await this.roleRepository.create(dto)
        const permissions: RolePermissions =
            await this.permissionsService.createDefaultRolePermissions(role.id)
        role.permissions = permissions
        return role
    }

    async addRoleToUser(dto: RoleIdAndUserIdDto): Promise<RoleUser> {
        const roleUserRow: RoleUser = await this.roleUserRepository.create(dto)
        return roleUserRow
    }

    async removeRoleFromUser(dto: RoleIdAndUserIdDto): Promise<RoleUser> {
        const roleUserRow: RoleUser = await this.roleUserRepository.findOne({ where: { ...dto } })
        await roleUserRow.destroy()
        return roleUserRow
    }

    async updateRole({ role, color, name, permissions }: UpdateRoleDto): Promise<Role> {
        if (color) role.color = color
        if (name) role.name = name
        if (permissions) await role.permissions.update(permissions)
        await role.save()
        console.log(role)
        return role
    }

    async deleteRole({ role }: DeleteRoleDto): Promise<Role> {
        await role.destroy()
        return role
    }

}