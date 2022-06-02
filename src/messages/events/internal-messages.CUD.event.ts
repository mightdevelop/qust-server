import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'
import { Message } from '../models/messages.model'

export class InternalMessagesCudEvent {

    constructor({ action, message }: InternalMessagesCudEventArgs) {
        this.message = message
        this.action = action
    }

    message: Message

    action: CreateUpdateDelete

}

class InternalMessagesCudEventArgs {

    message: Message

    action: CreateUpdateDelete

}