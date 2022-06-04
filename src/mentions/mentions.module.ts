import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { MentionsController } from './mentions.controller'
import { MentionsService } from './mentions.service'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { Mention } from './models/mentions.model'
import { TextChannelsModule } from 'src/text-channels/text-channels.module'
import { MessagesModule } from 'src/messages/messages.module'
import { MentionsCreator } from './mentions.creator'
import { MentionsGateway } from './mentions.gateway'
import { SocketIoModule } from 'src/socketio/socketio.module'
import { JwtModule } from '@nestjs/jwt'


@Module({
    controllers: [ MentionsController ],
    providers: [
        MentionsService,
        MentionsGateway,
        MentionsCreator,
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
        JwtModule.register({}),
        SocketIoModule,
    ],
    exports: [ MentionsService ],
})
export class MentionsModule {}
