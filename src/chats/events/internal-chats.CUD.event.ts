import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'
import { Chat } from '../models/chats.model'

export class InternalChatsCudEvent {

    constructor({ chat, action }: InternalChatsCudEventArgs) {
        this.chat = chat
        this.action = action
    }

    chat: Chat

    action: CreateUpdateDelete

}

class InternalChatsCudEventArgs {

    chat: Chat

    action: CreateUpdateDelete

}