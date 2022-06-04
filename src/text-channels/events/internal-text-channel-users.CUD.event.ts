import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'
export class InternalTextChannelUsersCudEvent {

    constructor({ textChannelId, usersIds, action }: InternalTextChannelUsersCudEventEventArgs) {
        this.textChannelId = textChannelId
        this.usersIds = usersIds
        this.action = action
    }

    textChannelId: string

    usersIds: string[]

    action: CreateUpdateDelete

}

class InternalTextChannelUsersCudEventEventArgs {

    textChannelId: string

    usersIds: string[]

    action: CreateUpdateDelete

}