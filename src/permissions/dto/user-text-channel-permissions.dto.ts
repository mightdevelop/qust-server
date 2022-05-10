import { IsArray, IsUUID } from 'class-validator'
import { RolePermissionsEnum } from '../types/permissions/role-permissions.enum'

export class UserPermissionsInTextChannelDto {

    @IsUUID()
        userId: string

    @IsUUID()
        channelId: string

    @IsArray()
        requiredPermissions: RolePermissionsEnum[]

}