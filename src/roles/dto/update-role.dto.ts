import { Type } from 'class-transformer'
import { IsHexColor, IsUUID, IsOptional, IsString } from 'class-validator'
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
    @IsOptional()
        groupId?: number

}