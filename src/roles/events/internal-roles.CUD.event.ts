import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'
import { Role } from '../models/roles.model'

export class InternalRolesCudEvent {

    constructor({ userIdWhoTriggered, role, usersIds, action }: InternalRolesCudEventArgs) {
        this.userIdWhoTriggered = userIdWhoTriggered
        this.role = role
        this.usersIds = usersIds
        this.action = action
    }

    userIdWhoTriggered: string

    role: Role

    usersIds: string[]

    action: CreateUpdateDelete

}

class InternalRolesCudEventArgs {

    userIdWhoTriggered: string

    role: Role

    usersIds: string[]

    action: CreateUpdateDelete

}