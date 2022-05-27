import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersService } from './users.service'
import { User } from './models/users.model'
import { UsersController } from './users.controller'
import { ChatUser } from 'src/chats/models/chat-user.model'
import { Friend } from 'src/friends/models/friends.model'
import { GroupUser } from 'src/groups/models/group-user.model'

@Global()
@Module({
    controllers: [ UsersController ],
    providers: [
        UsersService,
    ],
    imports: [
        SequelizeModule.forFeature([ User, Friend, ChatUser, GroupUser ]),
        JwtModule.register({}),
    ],
    exports: [
        UsersService,
    ]
})

export class UsersModule {}