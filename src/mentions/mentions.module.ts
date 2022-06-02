import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { MentionsController } from './mentions.controller'
import { MentionsService } from './mentions.service'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { Mention } from './models/mentions.model'
import { TextChannelsModule } from 'src/text-channels/text-channels.module'
import { MessagesModule } from 'src/messages/messages.module'
import { MessagesListener } from './messages-listener.service'


@Module({
    controllers: [ MentionsController ],
    providers: [
        MentionsService,
        MessagesListener,
    ],
    imports: [
        SequelizeModule.forFeature([ Mention ]),
        EventEmitterModule.forRoot({
            wildcard: false,
            delimiter: '.',
            newListener: false,
            removeListener: false,
            maxListeners: 10,
            verboseMemoryLeak: false,
            ignoreErrors: false,
        }),
        TextChannelsModule,
        MessagesModule,
    ],
    exports: [ MentionsService ],
})
export class MentionsModule {}
