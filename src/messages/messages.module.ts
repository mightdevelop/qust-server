import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ChatMessageService } from './chat-message.service'
import { MessageContentService } from './message-content.service'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'
import { ChatMessage } from './models/chat-message'
import { MessageContent } from './models/message-content.model'
import { Message } from './models/messages.model'


@Module({
    controllers: [ MessagesController ],
    providers: [
        ChatMessageService,
        MessagesService,
        MessageContentService
    ],
    imports: [
        SequelizeModule.forFeature([ Message, MessageContent, ChatMessage ]),
    ],
    exports: [ ChatMessageService ],
})
export class MessagesModule {}
