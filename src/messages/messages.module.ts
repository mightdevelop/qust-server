import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ChatMessagesService } from './chat-messages.service'
import { MessageContentService } from './message-content.service'
import { ChatMessage } from './models/chat-message'
import { MessageContent } from './models/message-content.model'
import { Message } from './models/messages.model'


@Module({
    imports: [
        SequelizeModule.forFeature([ Message, MessageContent, ChatMessage ]),
    ],
    exports: [ ChatMessagesService ],
    providers: [ ChatMessagesService, MessageContentService ],
})
export class MessagesModule {}
