import { RolePermissionsEnum } from '../types/permissions/role-permissions.enum'

export class UserPermissionsInGroupDto {

    userId: string

    groupId?: string

    categoryId?: string

    requiredPermissions: RolePermissionsEnum[]

}