import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'
export class InternalGroupUsersCudEvent {

    constructor({ groupId, usersIds, action }: InternalGroupUsersCudEventEventArgs) {
        this.groupId = groupId
        this.usersIds = usersIds
        this.action = action
    }

    groupId: string

    usersIds: string[]

    action: CreateUpdateDelete

}

class InternalGroupUsersCudEventEventArgs {

    groupId: string

    usersIds: string[]

    action: CreateUpdateDelete

}