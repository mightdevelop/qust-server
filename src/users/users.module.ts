import { Global, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersService } from './users.service'
import { User } from './models/users.model'
import { UsersController } from './users.controller'
import { ChatUser } from 'src/chats/models/chat-user.model'
import { Friend } from 'src/friends/models/friends.model'
import { GroupUser } from 'src/groups/models/group-user.model'
import { UsersGateway } from './users.gateway'
import { SocketIoModule } from 'src/socketio/socketio.module'
import { JwtModule } from '@nestjs/jwt'
import { UserSettingsModule } from 'src/users-settings/users-settings.module'
import { UserSettings } from 'src/users-settings/models/user-settings.model'

@Global()
@Module({
    controllers: [ UsersController ],
    providers: [
        UsersService,
        UsersGateway,
    ],
    imports: [
        SequelizeModule.forFeature([ User, Friend, ChatUser, GroupUser, UserSettings ]),
        SocketIoModule,
        UserSettingsModule,
        JwtModule.register({})
    ],
    exports: [
        UsersService,
    ]
})

export class UsersModule {}