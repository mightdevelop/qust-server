import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'
import { Role } from '../models/roles.model'

export class InternalRolesCudEvent {

    constructor({ userIdWhoTriggered, role, groupId, action }: InternalRolesCudEventArgs) {
        this.userIdWhoTriggered = userIdWhoTriggered
        this.role = role
        this.groupId = groupId
        this.action = action
    }

    userIdWhoTriggered: string

    role: Role

    groupId: string

    action: CreateUpdateDelete

}

class InternalRolesCudEventArgs {

    userIdWhoTriggered: string

    role: Role

    groupId: string

    action: CreateUpdateDelete

}