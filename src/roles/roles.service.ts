import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateRoleDto } from './dto/create-role.dto'
import { DeleteRoleDto } from './dto/delete-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Role } from './models/roles.model'


@Injectable()
export class RolesService {

    constructor(
        @InjectModel(Role) private roleRepository: typeof Role,
    ) {}

    async createRole(dto: CreateRoleDto): Promise<Role> {
        const role: Role = await this.roleRepository.create(dto)
        return role
    }

    async updateRole({ role, color, groupId, name }: UpdateRoleDto): Promise<Role> {
        await role.update({ color, groupId, name })
        return role
    }

    async deleteRole({ role }: DeleteRoleDto): Promise<Role> {
        await role.destroy()
        return role
    }

}