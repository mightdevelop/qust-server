import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersService } from './users.service'
import { User } from './models/users.model'
import { UsersController } from './users.controller'
import { ChatUser } from 'src/chats/models/chat-user.model'
import { Friend } from 'src/friends/models/friends.model'


@Module({
    controllers: [ UsersController ],
    providers: [
        UsersService,
    ],
    imports: [
        SequelizeModule.forFeature([ User, ChatUser, Friend ]),
        JwtModule.register({}),
    ],
    exports: [
        UsersService,
    ]
})

export class UsersModule {}