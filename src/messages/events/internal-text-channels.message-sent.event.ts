import { Message } from '../models/messages.model'

export class InternalTextChannelsMessageSentEvent {

    constructor({ message, channelId }: InternalTextChannelsMessageSentEventArgs) {
        this.message = message
        this.channelId = channelId
    }

    message: Message

    channelId: string

}

class InternalTextChannelsMessageSentEventArgs {

    message: Message

    channelId: string

}