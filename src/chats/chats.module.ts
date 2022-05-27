import { forwardRef, Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { JwtModule } from '@nestjs/jwt'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from 'src/auth/auth.module'
import { MessagesModule } from 'src/messages/messages.module'
import { SocketIoModule } from 'src/socketio/socketio.module'
import { UsersModule } from 'src/users/users.module'
import { ChatsController } from './chats.controller'
import { ChatGateway } from './chats.gateway'
import { ChatsService } from './chats.service'
import { ChatUser } from './models/chat-user.model'
import { Chat } from './models/chats.model'

@Module({
    controllers: [ ChatsController ],
    providers: [ ChatsService, ChatGateway ],
    imports: [
        SequelizeModule.forFeature([ Chat, ChatUser ]),
        EventEmitterModule.forRoot({
            wildcard: false,
            delimiter: '.',
            newListener: false,
            removeListener: false,
            maxListeners: 10,
            verboseMemoryLeak: false,
            ignoreErrors: false,
        }),
        forwardRef(() => AuthModule),
        MessagesModule,
        UsersModule,
        SocketIoModule,
        JwtModule.register({}),
    ],
    exports: [ ChatsService ]
})
export class ChatsModule {}
