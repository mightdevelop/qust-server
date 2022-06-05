import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'
import { Message } from '../models/messages.model'

export class InternalMessagesCudEvent {

    constructor({ message, noMentions, action }: InternalMessagesCudEventArgs) {
        this.message = message
        this.noMentions = noMentions
        this.action = action
    }

    message: Message

    noMentions: boolean

    action: CreateUpdateDelete

}

class InternalMessagesCudEventArgs {

    message: Message

    noMentions?: boolean

    action: CreateUpdateDelete

}