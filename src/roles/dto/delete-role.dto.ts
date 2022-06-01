import { Type } from 'class-transformer'
import { IsUUID } from 'class-validator'
import { Role } from '../models/roles.model'

export class DeleteRoleDto {

    @Type(() => Role)
        role: Role

    @IsUUID()
        userId: string

}