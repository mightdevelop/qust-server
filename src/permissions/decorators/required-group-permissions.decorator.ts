import { SetMetadata } from '@nestjs/common'
import { RolePermissionsEnum } from '../types/permissions/role-permissions.enum'

export const GROUP_PERMISSIONS_KEY = 'group-permissions'
export const RequiredGroupPermissions = (permissions: RolePermissionsEnum[]) =>
    SetMetadata(GROUP_PERMISSIONS_KEY, permissions)