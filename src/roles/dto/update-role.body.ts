import { Type } from 'class-transformer'
import { IsHexColor, IsOptional, IsString } from 'class-validator'
import { RolePermissionsListClass } from 'src/permissions/types/permissions/role-permissions-list.class'

export class UpdateRoleBody {

    @IsString()
    @IsOptional()
        name?: string

    @IsHexColor()
    @IsOptional()
        color?: string

    @Type(() => RolePermissionsListClass)
    @IsOptional()
        permissions?: RolePermissionsListClass

}