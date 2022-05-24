import { SetMetadata } from '@nestjs/common'
import { RoleTextChannelPermissionsEnum } from '../types/permissions/role-text-channel-permissions.enum'

export const SOCKETIO_TEXTCHANNEL_PERMISSIONS_KEY = 'socketio-textchannel-permissions'
export const SocketIoRequiredTextChannelPermissions = (permissions: RoleTextChannelPermissionsEnum[]) =>
    SetMetadata(SOCKETIO_TEXTCHANNEL_PERMISSIONS_KEY, permissions)