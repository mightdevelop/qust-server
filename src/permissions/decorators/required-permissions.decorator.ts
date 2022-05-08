import { SetMetadata } from '@nestjs/common'
import { RolePermissionsEnum } from '../types/permissions/role-permissions.enum'

export const PERMISSIONS_KEY = 'permissions'
export const RequiredPermissions = (permissions: RolePermissionsEnum[]) =>
    SetMetadata(PERMISSIONS_KEY, permissions)