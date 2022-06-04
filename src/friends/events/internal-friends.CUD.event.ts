import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'

export class InternalFriendsCudEvent {

    constructor({ friendsIds, action }: InternalFriendsCudEventArgs) {
        this.friendsIds = friendsIds
        this.action = action
    }

    friendsIds: string[]

    action: CreateUpdateDelete

}

class InternalFriendsCudEventArgs {

    friendsIds: string[]

    action: CreateUpdateDelete

}