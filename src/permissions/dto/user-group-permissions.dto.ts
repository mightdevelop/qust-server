import { IsArray, IsUUID } from 'class-validator'
import { RolePermissionsEnum } from '../types/permissions/role-permissions.enum'

export class UserPermissionsInGroupDto {

    @IsUUID()
        userId: string

    @IsUUID()
        groupId: string

    @IsArray()
        permissions: RolePermissionsEnum[]

}