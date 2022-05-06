import { SetMetadata } from '@nestjs/common'
import { RolePermissionsList } from 'src/roles/types/permissions/permissions'

export const PERMISSIONS_KEY = 'permissions'
export const RequiredPermissions = (permissions: RolePermissionsList) =>
    SetMetadata(PERMISSIONS_KEY, permissions)