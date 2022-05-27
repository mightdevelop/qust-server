import { Type } from 'class-transformer'
import { Chat } from '../models/chats.model'

export class InternalChatDeletedEvent {

    constructor({ chat }: InternalChatDeletedEventArgs) {
        this.chat = chat
    }

    chat: Chat

}

class InternalChatDeletedEventArgs {

    @Type(() => Chat)
        chat: Chat

}