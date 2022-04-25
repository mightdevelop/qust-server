import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './users/models/users.model'
import 'dotenv/config'
import { AuthModule } from './auth/auth.module'
import { Friend } from './friends/models/friends.model'
import { Notification } from './notifications/models/notifications.model'
import { UsersModule } from './users/users.module'
import { FriendsModule } from './friends/friends.module'
import { NotificationsModule } from './notifications/notifications.module'
import { MessagesModule } from './messages/messages.module'
import { ChatsModule } from './chat/chats.module'
import { Chat } from './chat/models/chats.model'
import { Message } from './messages/models/messages.model'
import { MessageContent } from './messages/models/message-content.model'
import { ChatUser } from './chat/models/chat-user.model'


@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `@${process.env.NODE_ENV}.env`,
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: String(process.env.POSTGRES_PASSWORD),
            database: process.env.POSTGRES_DB,
            models: [
                User,
                Friend,
                Notification,
                Chat,
                ChatUser,
                Message,
                MessageContent,
            ],
            autoLoadModels: true,
        }),
        forwardRef(() => AuthModule),
        forwardRef(() => UsersModule),
        forwardRef(() => FriendsModule),
        forwardRef(() => NotificationsModule),
        forwardRef(() => MessagesModule),
        forwardRef(() => ChatsModule),
    ]
})
export class AppModule {}
