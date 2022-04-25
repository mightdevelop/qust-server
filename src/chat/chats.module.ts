import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from 'src/auth/auth.module'
import { ChatsService } from './chats.service'
import { ChatUser } from './models/chat-user.model'
import { Chat } from './models/chats.model'

@Module({
    providers: [ ChatsService ],
    imports: [
        SequelizeModule.forFeature([ Chat, ChatUser ]),
        forwardRef(() => AuthModule)
    ]
})
export class ChatsModule {}
