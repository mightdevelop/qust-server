import { IsHexColor, IsUUID, IsString } from 'class-validator'

export class CreateRoleDto {

    @IsString()
        name: string

    @IsHexColor()
        color?: string

    @IsUUID()
        groupId: string

}