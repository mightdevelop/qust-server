import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from 'src/auth/auth.module'
import { NotificationsModule } from 'src/notifications/notifications.module'
import { ChatsController } from './chats.controller'
import { ChatsService } from './chats.service'
import { ChatUser } from './models/chat-user.model'
import { Chat } from './models/chats.model'

@Module({
    controllers: [ ChatsController ],
    providers: [ ChatsService ],
    imports: [
        SequelizeModule.forFeature([ Chat, ChatUser ]),
        forwardRef(() => AuthModule),
        NotificationsModule
    ],
    exports: [ ChatsService ]
})
export class ChatsModule {}
