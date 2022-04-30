import { Controller } from '@nestjs/common'
import { ChatMessagesService } from './chat-messages.service'


@Controller('/messages')
export class MessagesController {

    constructor(
        private chatMessagesService: ChatMessagesService,
    ) {}



}