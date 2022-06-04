import { IsArray, IsUUID } from 'class-validator'
import { RoleTextChannelPermissionsEnum } from '../types/permissions/role-text-channel-permissions.enum'

export class UserPermissionsInTextChannelDto {

    @IsUUID()
        userId: string

    @IsUUID()
        textChannelId: string

    @IsArray()
        requiredPermissions: RoleTextChannelPermissionsEnum[]

}