import { Type } from 'class-transformer'
import { Chat } from '../models/chats.model'

export class InternalChatCreatedEvent {

    constructor({ chat }: InternalChatCreatedEventArgs) {
        this.chat = chat
    }

    chat: Chat

}

class InternalChatCreatedEventArgs {

    @Type(() => Chat)
        chat: Chat

}