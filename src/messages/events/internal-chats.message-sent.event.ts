import { Type } from 'class-transformer'
import { IsUUID } from 'class-validator'
import { Message } from '../models/messages.model'

export class InternalChatsMessageSentEvent {

    constructor({ message, chatId }: InternalChatsMessageSentEventArgs) {
        this.message = message
        this.chatId = chatId
    }

    message: Message

    chatId: string

}

class InternalChatsMessageSentEventArgs {

    @Type(() => Message)
        message: Message

    @IsUUID()
        chatId: string

}