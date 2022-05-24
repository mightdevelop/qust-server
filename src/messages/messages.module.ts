import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ChatMessageService } from './chat-message.service'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'
import { ChatMessage } from './models/chat-message.model'
import { MessageContent } from './models/message-content.model'
import { Message } from './models/messages.model'
import { TextChannelMessage } from './models/text-channel-message.model'
import { TextChannelMessageService } from './text-channel-message.service'


@Module({
    controllers: [ MessagesController ],
    providers: [
        ChatMessageService,
        TextChannelMessageService,
        MessagesService,
    ],
    imports: [
        SequelizeModule.forFeature([ Message, MessageContent, ChatMessage, TextChannelMessage ]),
    ],
    exports: [ ChatMessageService, TextChannelMessageService ],
})
export class MessagesModule {}
