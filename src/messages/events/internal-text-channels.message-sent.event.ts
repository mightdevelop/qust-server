import { Type } from 'class-transformer'
import { IsUUID } from 'class-validator'
import { Message } from '../models/messages.model'

export class InternalTextChannelssMessageSentEvent {

    constructor({ message, channelId }: InternalTextChannelssMessageSentEventArgs) {
        this.message = message
        this.channelId = channelId
    }

    message: Message

    channelId: string

}

class InternalTextChannelssMessageSentEventArgs {

    @Type(() => Message)
        message: Message

    @IsUUID()
        channelId: string

}