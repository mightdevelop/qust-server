import { IsArray, IsUUID, ValidateNested } from 'class-validator'

export class InternalRolesDeletedEvent {

    constructor({ roleId, usersIds }: InternalRolesDeletedEventArgs) {
        this.roleId = roleId
        this.usersIds = usersIds
    }

    roleId: string

    usersIds: string[]

}

class InternalRolesDeletedEventArgs {

    @IsUUID()
        roleId: string

    @IsArray()
    @ValidateNested({ each: true })
    @IsUUID()
        usersIds: string[]

}