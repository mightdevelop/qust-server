import { IsUUID } from 'class-validator'

export class RoleIdAndUserIdDto {

    @IsUUID()
        roleId: string

    @IsUUID()
        userId: string

}