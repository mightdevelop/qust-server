import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'

export class InternalChatUsersCudEvent {

    constructor({ chatId, usersIds, action }: InternalChatUsersCudEventEventArgs) {
        this.chatId = chatId
        this.usersIds = usersIds
        this.action = action
    }

    chatId: string

    usersIds: string[]

    action: CreateUpdateDelete

}

class InternalChatUsersCudEventEventArgs {

    chatId: string

    usersIds: string[]

    action: CreateUpdateDelete

}