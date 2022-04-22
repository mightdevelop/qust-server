import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from 'src/users/models/users.model'
import { UsersModule } from 'src/users/users.module'
import { FriendsController } from './friends.controller'
import { FriendsService } from './friends.service'
import { Friend } from './models/friends.model'


@Module({
    controllers: [ FriendsController ],
    providers: [
        FriendsService,
    ],
    imports: [
        SequelizeModule.forFeature([ Friend, User ]),
        forwardRef(() => UsersModule)
    ],
    exports: [ FriendsService ]
})

export class FriendsModule {}