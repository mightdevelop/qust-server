import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'
import { User } from '../models/users.model'

export class InternalUsersCudEvent {

    constructor(
        { user, action }: InternalUsersCudEventArgs
    ) {
        this.user = user
        this.action = action
    }

    user: User

    action: CreateUpdateDelete

}

class InternalUsersCudEventArgs {

    user: User

    action: CreateUpdateDelete

}