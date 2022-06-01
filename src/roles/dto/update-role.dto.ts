import { Type } from 'class-transformer'
import { IsHexColor, IsUUID, IsOptional, IsString } from 'class-validator'
import { RolePermissionsListClass } from 'src/permissions/types/permissions/role-permissions-list.class'
import { Role } from '../models/roles.model'

export class UpdateRoleDto {

    @Type(() => Role)
        role: Role

    @IsString()
    @IsOptional()
        name?: string

    @IsHexColor()
    @IsOptional()
        color?: string

    @IsUUID()
        userId: string

    @Type(() => RolePermissionsListClass)
    @IsOptional()
        permissions?: RolePermissionsListClass

}