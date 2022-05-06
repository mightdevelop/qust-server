import { IsHexColor, IsNumber, IsString } from 'class-validator'

export class CreateRoleDto {

    @IsString()
        name: string

    @IsHexColor()
        color: string

    @IsNumber()
        groupId: number

}