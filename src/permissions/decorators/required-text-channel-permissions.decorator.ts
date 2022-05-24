import { SetMetadata } from '@nestjs/common'
import { RoleTextChannelPermissionsEnum } from '../types/permissions/role-text-channel-permissions.enum'

export const TEXTCHANNEL_PERMISSIONS_KEY = 'textchannel-permissions'
export const RequiredTextChannelPermissions = (permissions: RoleTextChannelPermissionsEnum[]) =>
    SetMetadata(TEXTCHANNEL_PERMISSIONS_KEY, permissions)