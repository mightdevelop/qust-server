import { Message } from '../models/messages.model'

export class InternalTextChannelsMessageSentEvent {

    constructor({ message, textChannelId }: InternalTextChannelsMessageSentEventArgs) {
        this.message = message
        this.textChannelId = textChannelId
    }

    message: Message

    textChannelId: string

}

class InternalTextChannelsMessageSentEventArgs {

    message: Message

    textChannelId: string

}