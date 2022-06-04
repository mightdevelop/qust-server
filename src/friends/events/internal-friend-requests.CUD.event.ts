import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'

export class InternalFriendRequestsCudEvent {

    constructor({ requestedUserId, respondingUserId, action }: InternalFriendRequestsCudArgs) {
        this.requestedUserId = requestedUserId
        this.respondingUserId = respondingUserId
        this.action = action
    }

    requestedUserId: string

    respondingUserId: string

    action: CreateUpdateDelete

}

class InternalFriendRequestsCudArgs {

    requestedUserId: string

    respondingUserId: string

    action: CreateUpdateDelete

}