import { IsHexColor, IsUUID, IsString, IsOptional } from 'class-validator'

export class CreateRoleDto {

    @IsString()
        name: string

    @IsHexColor()
    @IsOptional()
        color?: string

    @IsUUID()
        groupId: string

}