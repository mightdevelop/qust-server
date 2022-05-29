import { Type } from 'class-transformer'
import { IsArray, IsUUID, ValidateNested } from 'class-validator'
import { Role } from '../models/roles.model'

export class InternalRolesUpdatedEvent {

    constructor({ role, usersIds }: InternalRolesUpdatedEventArgs) {
        this.role = role
        this.usersIds = usersIds
    }

    role: Role

    usersIds: string[]

}

class InternalRolesUpdatedEventArgs {

    @Type(() => Role)
        role: Role

    @IsArray()
    @ValidateNested({ each: true })
    @IsUUID()
        usersIds: string[]

}