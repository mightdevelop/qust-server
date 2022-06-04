import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ChatMessageService } from './chat-message.service'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'
import { ChatMessage } from './models/chat-message.model'
import { MessageContent } from './models/message-content.model'
import { Message } from './models/messages.model'
import { TextChannelMessage } from './models/text-channel-message.model'
import { TextChannelMessageService } from './text-channel-message.service'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TextChannelsModule } from 'src/text-channels/text-channels.module'


@Module({
    controllers: [ MessagesController ],
    providers: [
        ChatMessageService,
        TextChannelMessageService,
        MessagesService,
    ],
    imports: [
        SequelizeModule.forFeature([ Message, MessageContent, ChatMessage, TextChannelMessage ]),
        EventEmitterModule.forRoot({
            wildcard: false,
            delimiter: '.',
            newListener: false,
            removeListener: false,
            maxListeners: 10,
            verboseMemoryLeak: false,
            ignoreErrors: false,
        }),
        forwardRef(() => TextChannelsModule),
    ],
    exports: [ ChatMessageService, TextChannelMessageService, MessagesService ],
})
export class MessagesModule {}
