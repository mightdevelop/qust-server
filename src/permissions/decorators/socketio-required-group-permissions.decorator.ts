import { SetMetadata } from '@nestjs/common'
import { RolePermissionsEnum } from '../types/permissions/role-permissions.enum'

export const SOCKETIO_GROUP_PERMISSIONS_KEY = 'socketio-group-permissions'
export const SocketIoRequiredGroupPermissions = (permissions: RolePermissionsEnum[]) =>
    SetMetadata(SOCKETIO_GROUP_PERMISSIONS_KEY, permissions)