import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { CreateRoleDto } from './dto/create-role.dto'
import { DeleteRoleDto } from './dto/delete-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RolePermissions } from './models/role-permissions.model'
import { RoleUser } from './models/role-user.model'
import { Role } from './models/roles.model'


@Injectable()
export class RolesService {

    constructor(
        @InjectModel(Role) private roleRepository: typeof Role,
        @InjectModel(RoleUser) private roleUserRepository: typeof RoleUser,
    ) {}

    async getRoleById(roleId: string): Promise<Role> {
        const role: Role = await this.roleRepository.findByPk(roleId)
        return role
    }

    async getUserRolesByGroupId(userId: string, groupId: string, include?: boolean): Promise<Role[]> {
        // const groupRoles: Role[] = await this.roleRepository.findAll({
        //     where: { groupId },
        //     include: include ? RolePermissions: 'none'
        // })
        const groupRoles: Role[] =
            include
                ?
                await this.roleRepository.findAll({ where: { groupId }, include: RolePermissions })
                :
                await this.roleRepository.findAll({ where: { groupId } })
        const roleUserColumns: RoleUser[] = await this.roleUserRepository.findAll({ where: {
            [Op.or]: groupRoles.map(role => {
                return {
                    userId,
                    roleId: role.id
                }
            })
        } })
        const userRoles: Role[] = await this.roleRepository.findAll({ where: {
            [Op.or]: roleUserColumns.map(role => { return { roleId: role.id } }) }
        })
        return userRoles
    }

    async createRole(dto: CreateRoleDto): Promise<Role> {
        const role: Role = await this.roleRepository.create(dto)
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