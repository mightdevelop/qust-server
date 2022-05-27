import { Type } from 'class-transformer'
import { Chat } from '../models/chats.model'

export class InternalChatUpdatedEvent {

    constructor({ chat }: InternalChatUpdatedEventArgs) {
        this.chat = chat
    }

    chat: Chat

}

class InternalChatUpdatedEventArgs {

    @Type(() => Chat)
        chat: Chat

}