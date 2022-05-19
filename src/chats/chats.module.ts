import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from 'src/auth/auth.module'
import { MessagesModule } from 'src/messages/messages.module'
import { UsersModule } from 'src/users/users.module'
import { ChatsController } from './chats.controller'
import { ChatGateway } from './chats.gateaway'
import { ChatsService } from './chats.service'
import { ChatUser } from './models/chat-user.model'
import { Chat } from './models/chats.model'

@Module({
    controllers: [ ChatsController ],
    providers: [ ChatsService, ChatGateway ],
    imports: [
        SequelizeModule.forFeature([ Chat, ChatUser ]),
        forwardRef(() => AuthModule),
        MessagesModule,
        UsersModule,
        JwtModule.register({}),
    ],
    exports: [ ChatsService ]
})
export class ChatsModule {}
