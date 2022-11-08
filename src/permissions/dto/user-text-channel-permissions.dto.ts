import { RoleTextChannelPermissionsEnum } from '../types/permissions/role-text-channel-permissions.enum'

export class UserPermissionsInTextChannelDto {

    userId: string

    textChannelId: string

    requiredPermissions: RoleTextChannelPermissionsEnum[]

}