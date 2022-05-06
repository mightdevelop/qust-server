import { Type } from 'class-transformer'
import { Role } from '../models/roles.model'

export class DeleteRoleDto {

    @Type(() => Role)
        role: Role

}